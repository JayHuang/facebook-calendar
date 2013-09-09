var layOutDay = (function() {
	"use strict";
	var tree;
	var target = $('.events-container');
	var maxHeight = 720;
	var maxWidth = 600;
	var id = 0;

	var siblingIndex = {
		index: {},
		clear: function() {
			this.index = {};
		},

		add: function(node) {
			var level = this.index[node.offset] || (this.index[node.offset] = []);
			level.push(node);
		},

		get: function(offset) {
			return this.index[offset] || [];
		}
	};

	//Add node to tree
	function append(node, item, offset) {

		item.offset = ++offset;
		siblingIndex.add(item);
		node.children.push(item);
		item.parent = node;
		item.id = id++;
		tree.push(item);

	}

	function overlaps(node, item) {
		if(item.start >= node.start && item.start < node.end) {
			return true;
		} else if((node.start == item.start) || (node.end == item.end)) {
			return true;
		} else {
			return false;
		}
	}

	//Iterates over list of nodes
	function iterate(list, item, offset) {
		for(var key in list) {
			if(traverse(list[key], item, offset)) {
				return true;
			}
		}
		return false;
	}

	//Returns success status of tree placement
	function traverse(node, item, offset) {
		if(overlaps(node, item)) {
			if(iterate(siblingIndex.get(offset+1), item, offset+1)) {
				return true;
			}

			append(node, item, offset);
			return true;
		}
		return false;
	}

	function filterAndSort(data) {

		if( Object.prototype.toString.call( data ) !== '[object Array]' ) {
			return [];
		}

		return data.filter(function(item) {

			if(item.start === void 0 || item.end === void 0) {
				return false;
			}

			if(item.end > maxHeight) {
				return false;
			}

			if(item.start >= item.end) {
				return false;
			}

			if(item.start < 0) {
				return false;
			}

			return true;
		}).sort(function(a, b) {

			if((a.start - b.start) === 0) {
				return b.end - a.end;
			} else {
				return a.start - b.start;
			}
		});
	}

	function prepare(data) {
		return filterAndSort(data).map(function(node) {
			return {
				id       : node.id,
				start    : node.start,
				end      : node.end,
				height   : node.end - node.start,
				width    : 0,

				children : [],
				offset    : 0,
				maxoffset : 0
			};
		});
	}

	//Finds max offset for each branch
	function setMaxOffset() {

		var setChildren = function(node, offset) {
			node.maxoffset = offset;
			node.children.forEach(function(child) {
				setChildren(child, offset);
			});
		};

		var leaves = tree.filter(function(node) {
			return node.children.length === 0;
		});

		var roots = {}, currentRoot;
		leaves.forEach(function(leaf) {
			var node = leaf, maxoffset = 0;
			while(1) {
				maxoffset = Math.max(maxoffset, node.offset);
				if(node.parent.offset >= 0) {
					node = node.parent;
				} else {
					currentRoot = roots[node.id] || (roots[node.id] = node);
					currentRoot.maxoffset = Math.max(currentRoot.maxoffset, maxoffset);
					break;
				}
			}
		});

		for(var rootId in roots) {
			setChildren(roots[rootId], roots[rootId].maxoffset);
		}

		tree.forEach(function(leaf) {
			var nextoffset = leaf.maxoffset+1;
			var siblings  = siblingIndex.get(nextoffset);
			while(siblings.length > 0) {
				for(var index in siblings) {
					if(overlaps(siblings[index], leaf)) {
						leaf.maxoffset = Math.max(leaf.maxoffset, siblings[index].maxoffset);
						return;
					}
				}
				siblings = siblingIndex.get(++nextoffset);
			}
		});
	}

	function setNodeWidths() {
		setMaxOffset();

		tree.forEach(function(node) {
			node.width = maxWidth / (node.maxoffset+1);
		});
	}

	function format(tree) {
		return tree.map(function(node) {
			return {
				id     : node.id,
				start  : node.start,
				end    : node.end,
				top    : node.start,
				left   : node.width * node.offset,
				width  : node.width,
				height : node.height
			};
		});
	}

	function initTree() {
		return [
			{
				id       : 'root',
				start    : 0,
				end      : 720,
				offset    : -1,
				children : []
			}
		];
	}

	//layOutDay
	return function (input) {
		tree = initTree();

		siblingIndex.clear();

		id = 0;

		input = prepare(input);

		var root = tree[0];

		input.forEach(function(item) {
			traverse(root, item, -1);
		});

		setNodeWidths();

		tree.shift();

		target.children().remove();
		format(tree).forEach(function(event){
			var wrapper = $('<div>').addClass('event').css({
				top    : event.top    + 'px',
				left   : event.left   + 'px',
				width  : event.width  + 'px',
				height : event.height + 'px'
			});
			$('<a>Sample item<span>Sample location</span></a>').appendTo(wrapper);
			wrapper.appendTo(target);
		});

		return format(tree);
	};
})();