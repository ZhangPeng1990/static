(function(c) {
	function a(f, h, m, s) {
		var n = this;
		n.container = c(f), n.sequence = n.container.children("ul");
		try {
			Modernizr.prefixed;
			if (Modernizr.prefixed === undefined) {
				throw "undefined"
			}
		} catch (i) {
			s.modernizr()
		}
		var r = {
			WebkitTransition: "-webkit-",
			MozTransition: "-moz-",
			OTransition: "-o-",
			msTransition: "-ms-",
			transition: ""
		},
			t = {
				WebkitTransition: "webkitTransitionEnd webkitAnimationEnd",
				MozTransition: "transitionend animationend",
				OTransition: "otransitionend oanimationend",
				msTransition: "MSTransitionEnd MSAnimationEnd",
				transition: "transitionend animationend"
			};
		n.prefix = r[Modernizr.prefixed("transition")], n.transitionEnd = t[Modernizr.prefixed("transition")], n.transitionProperties = {}, n.numberOfFrames = n.sequence.children("li").length, n.transitionsSupported = (n.prefix !== undefined) ? true : false, n.hasTouch = ("ontouchstart" in window) ? true : false, n.active, n.navigationSkipThresholdActive = false, n.autoPlayTimer, n.isPaused = false, n.isHardPaused = false, n.mouseover = false, n.defaultPreloader, n.nextButton, n.prevButton, n.pauseButton, n.pauseIcon, n.delayUnpause, n.init = {
			uiElements: function(x, w) {
				switch (x) {
				case false:
					return undefined;
				case true:
					if (w === ".sequence-preloader") {
						s.defaultPreloader(n.container, n.transitionsSupported, n.prefix)
					}
					return c(w);
				default:
					return c(x)
				}
			}
		};
		n.paused = function() {}, n.unpaused = function() {}, n.beforeNextFrameAnimatesIn = function() {}, n.afterNextFrameAnimatesIn = function() {}, n.beforeCurrentFrameAnimatesOut = function() {}, n.afterCurrentFrameAnimatesOut = function() {}, n.beforeFirstFrameAnimatesIn = function() {}, n.afterFirstFrameAnimatesIn = function() {}, n.beforeLastFrameAnimatesIn = function() {}, n.afterLastFrameAnimatesIn = function() {}, n.afterLoaded = function() {};
		n.settings = c.extend({}, m, h);
		n.settings.preloader = n.init.uiElements(n.settings.preloader, ".sequence-preloader");
		n.firstFrame = (n.settings.animateStartingFrameIn) ? true : false;
		n.settings.unpauseDelay = (n.settings.unpauseDelay === null) ? n.settings.autoPlayDelay : n.settings.unpauseDelay;
		n.currentHashTag;
		n.getHashTagFrom = (n.settings.hashDataAttribute) ? "data-sequence-hashtag" : "id";
		n.frameHashID = [];
		n.direction = n.settings.autoPlayDirection;
		if (n.settings.hideFramesUntilPreloaded && n.settings.preloader) {
			n.sequence.children("li").hide()
		}
		if (n.prefix === "-o-") {
			n.transitionsSupported = s.operaTest()
		}
		n.modifyElements(n.sequence.children("li"), "0s");
		n.sequence.children("li").removeClass("animate-in");

		function o() {
			n.afterLoaded();
			if (n.settings.hideFramesUntilPreloaded && n.settings.preloader) {
				n.sequence.children("li").show()
			}
			if (n.settings.preloader) {
				if (n.settings.hidePreloaderUsingCSS && n.transitionsSupported) {
					n.prependPreloadingCompleteTo = (n.settings.prependPreloadingComplete == true) ? n.settings.preloader : c(n.settings.prependPreloadingComplete);
					n.prependPreloadingCompleteTo.addClass("preloading-complete");
					setTimeout(q, n.settings.hidePreloaderDelay)
				} else {
					n.settings.preloader.fadeOut(n.settings.hidePreloaderDelay, function() {
						clearInterval(n.defaultPreloader);
						q()
					})
				}
			} else {
				q()
			}
		}
		var u = n.settings.preloadTheseFrames.length;
		var g = n.settings.preloadTheseImages.length;
		if (n.settings.preloader && (u !== 0 || g !== 0)) {
			function v(z, y) {
				var w = [];
				if (!y) {
					for (var x = z; x > 0; x--) {
						n.sequence.children("li:nth-child(" + n.settings.preloadTheseFrames[x - 1] + ")").find("img").each(function() {
							w.push(c(this)[0])
						})
					}
				} else {
					for (var x = z; x > 0; x--) {
						w.push(c("body").find('img[src="' + n.settings.preloadTheseImages[x - 1] + '"]')[0])
					}
				}
				return w
			}
			var j = v(u);
			var l = v(g, true);
			var p = c(j.concat(l));
			var e = p.length;
			k(p, o)
		} else {
			c(window).bind("load", function() {
				o();
				c(this).unbind("load")
			})
		}
		function k(D, E) {
			BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			var A = D,
				G = c.isFunction(c.Deferred) ? c.Deferred() : 0,
				F = c.isFunction(G.notify),
				x = A.find("img").add(A.filter("img")),
				y = [],
				C = [],
				z = [];
			if (c.isPlainObject(E)) {
				c.each(E, function(H, I) {
					if (H === "callback") {
						E = I
					} else {
						if (G) {
							G[H](I)
						}
					}
				})
			}
			function B() {
				var H = c(C),
					I = c(z);
				if (G) {
					if (z.length) {
						G.reject(x, H, I)
					} else {
						G.resolve(x)
					}
				}
				if (c.isFunction(E)) {
					E.call(A, x, H, I)
				}
			}
			function w(H, I) {
				if (H.src === BLANK || c.inArray(H, y) !== -1) {
					return
				}
				y.push(H);
				if (I) {
					z.push(H)
				} else {
					C.push(H)
				}
				c.data(H, "imagesLoaded", {
					isBroken: I,
					src: H.src
				});
				if (F) {
					G.notifyWith(c(H), [I, x, c(C), c(z)])
				}
				if (x.length === y.length) {
					setTimeout(B);
					x.unbind(".imagesLoaded")
				}
			}
			if (!x.length) {
				B()
			} else {
				x.bind("load.imagesLoaded error.imagesLoaded", function(H) {
					w(H.target, H.type === "error")
				}).each(function(H, J) {
					var K = J.src;
					var I = c.data(J, "imagesLoaded");
					if (I && I.src === K) {
						w(J, I.isBroken);
						return
					}
					if (J.complete && J.naturalWidth !== undefined) {
						w(J, J.naturalWidth === 0 || J.naturalHeight === 0);
						return
					}
					if (J.readyState || J.complete) {
						J.src = BLANK;
						J.src = K
					}
				})
			}
		}
		function q() {
			c(n.settings.preloader).remove();
			n.nextButton = n.init.uiElements(n.settings.nextButton, ".next");
			n.prevButton = n.init.uiElements(n.settings.prevButton, ".prev");
			n.pauseButton = n.init.uiElements(n.settings.pauseButton, ".pause");
			if ((n.nextButton !== undefined && n.nextButton !== false) && n.settings.showNextButtonOnInit) {
				n.nextButton.show()
			}
			if ((n.prevButton !== undefined && n.prevButton !== false) && n.settings.showPrevButtonOnInit) {
				n.prevButton.show()
			}
			if ((n.pauseButton !== undefined && n.pauseButton !== false)) {
				n.pauseButton.show()
			}
			if (n.settings.pauseIcon !== false) {
				n.pauseIcon = n.init.uiElements(n.settings.pauseIcon, ".pause-icon");
				if (n.pauseIcon !== undefined) {
					n.pauseIcon.hide()
				}
			} else {
				n.pauseIcon = undefined
			}
			n.nextFrameID = n.settings.startingFrameID;
			if (n.settings.hashTags) {
				n.sequence.children("li").each(function() {
					n.frameHashID.push(c(this).attr(n.getHashTagFrom))
				});
				n.currentHashTag = location.hash.replace("#", "");
				if (n.currentHashTag === undefined || n.currentHashTag === "") {
					n.nextFrameID = n.settings.startingFrameID
				} else {
					n.frameHashIndex = c.inArray(n.currentHashTag, n.frameHashID);
					if (n.frameHashIndex !== -1) {
						n.nextFrameID = n.frameHashIndex + 1
					} else {
						n.nextFrameID = n.settings.startingFrameID
					}
				}
			}
			n.nextFrame = n.sequence.children("li:nth-child(" + n.nextFrameID + ")");
			n.nextFrameChildren = n.nextFrame.children();
			if (n.transitionsSupported) {
				if (!n.settings.animateStartingFrameIn) {
					n.currentFrameID = n.nextFrameID;
					if (n.settings.moveActiveFrameToTop) {
						n.nextFrame.css("z-index", n.numberOfFrames)
					}
					n.modifyElements(n.nextFrameChildren, "0s");
					n.nextFrame.addClass("animate-in");
					if (n.settings.hashTags && n.settings.hashChangesOnFirstFrame) {
						n.currentHashTag = n.nextFrame.attr(n.getHashTagFrom);
						document.location.hash = "#" + n.currentHashTag
					}
					setTimeout(function() {
						n.modifyElements(n.nextFrameChildren, "")
					}, 100);
					n.resetAutoPlay(true, n.settings.autoPlayDelay)
				} else {
					if (n.settings.reverseAnimationsWhenNavigatingBackwards && n.settings.autoPlayDirection - 1 && n.settings.animateStartingFrameIn) {
						n.modifyElements(n.nextFrameChildren, "0s");
						n.nextFrame.addClass("animate-out");
						n.goTo(n.nextFrameID, -1)
					} else {
						n.goTo(n.nextFrameID, 1)
					}
				}
			} else {
				n.container.addClass("sequence-fallback");
				n.beforeNextFrameAnimatesIn();
				n.afterNextFrameAnimatesIn();
				if (n.settings.hashTags && n.settings.hashChangesOnFirstFrame) {
					n.currentHashTag = n.nextFrame.attr(n.getHashTagFrom);
					document.location.hash = "#" + n.currentHashTag
				}
				n.currentFrameID = n.nextFrameID;
				n.sequence.children("li").addClass("animate-in");
				n.sequence.children(":not(li:nth-child(" + n.nextFrameID + "))").css({
					display: "none",
					opacity: 0
				});
				n.resetAutoPlay(true, n.settings.autoPlayDelay)
			}
			if (n.nextButton !== undefined) {
				n.nextButton.click(function() {
					n.next()
				})
			}
			if (n.prevButton !== undefined) {
				n.prevButton.click(function() {
					n.prev()
				})
			}
			if (n.pauseButton !== undefined) {
				n.pauseButton.click(function() {
					n.pause(true)
				})
			}
			if (n.settings.keyNavigation) {
				var x = {
					left: 37,
					right: 39
				};

				function z(E, F) {
					var G;
					for (keyCodes in F) {
						if (keyCodes === "left" || keyCodes === "right") {
							G = x[keyCodes]
						} else {
							G = keyCodes
						}
						if (E === parseFloat(G)) {
							n.initCustomKeyEvent(F[keyCodes])
						}
					}
				}
				c(document).keydown(function(F) {
					var E = String.fromCharCode(F.keyCode);
					if ((E > 0 && E <= n.numberOfFrames) && (n.settings.numericKeysGoToFrames)) {
						n.nextFrameID = E;
						n.goTo(n.nextFrameID)
					}
					z(F.keyCode, n.settings.keyEvents);
					z(F.keyCode, n.settings.customKeyEvents)
				})
			}
			if (n.settings.pauseOnHover && n.settings.autoPlay && !n.hasTouch) {
				n.sequence.on({
					mouseenter: function() {
						n.mouseover = true;
						if (!n.isHardPaused) {
							n.pause()
						}
					},
					mouseleave: function() {
						n.mouseover = false;
						if (!n.isHardPaused) {
							n.unpause()
						}
					}
				})
			}
			if (n.settings.hashTags) {
				c(window).hashchange(function() {
					newTag = location.hash.replace("#", "");
					if (n.currentHashTag !== newTag) {
						n.currentHashTag = newTag;
						n.frameHashIndex = c.inArray(n.currentHashTag, n.frameHashID);
						if (n.frameHashIndex !== -1) {
							n.nextFrameID = n.frameHashIndex + 1;
							n.goTo(n.nextFrameID)
						}
					}
				})
			}
			if (n.settings.swipeNavigation && n.hasTouch) {
				var y;
				var w;
				var D = false;

				function C() {
					n.sequence.on("touchmove", A);
					y = null;
					D = false
				}
				function A(H) {
					if (n.settings.swipePreventsDefault) {
						H.preventDefault()
					}
					if (D) {
						var E = H.originalEvent.touches[0].pageX;
						var I = H.originalEvent.touches[0].pageY;
						var G = y - E;
						var F = w - I;
						if (Math.abs(G) >= n.settings.swipeThreshold) {
							C();
							if (G > 0) {
								n.initCustomKeyEvent(n.settings.swipeEvents.left)
							} else {
								n.initCustomKeyEvent(n.settings.swipeEvents.right)
							}
						} else {
							if (Math.abs(F) >= n.settings.swipeThreshold) {
								C();
								if (F > 0) {
									n.initCustomKeyEvent(n.settings.swipeEvents.down)
								} else {
									n.initCustomKeyEvent(n.settings.swipeEvents.up)
								}
							}
						}
					}
				}
				function B(E) {
					if (E.originalEvent.touches.length == 1) {
						y = E.originalEvent.touches[0].pageX;
						w = E.originalEvent.touches[0].pageY;
						D = true;
						n.sequence.on("touchmove", A)
					}
				}
				n.sequence.on("touchstart", B)
			}
		}
	}
	a.prototype = {
		initCustomKeyEvent: function(f) {
			var e = this;
			switch (f) {
			case "next":
				e.next();
				break;
			case "prev":
				e.prev();
				break;
			case "pause":
				e.pause(true);
				break
			}
		},
		modifyElements: function(g, e) {
			var f = this;
			g.css(f.prefixCSS(f.prefix, {
				"transition-duration": e,
				"transition-delay": e
			}))
		},
		prefixCSS: function(g, f) {
			var e = {};
			for (property in f) {
				e[g + property] = f[property]
			}
			return e
		},
		setTransitionProperties: function(f) {
			var e = this;
			f.each(function() {
				e.transitionProperties["transition-duration"] = c(this).css(e.prefix + "transition-duration");
				e.transitionProperties["transition-delay"] = c(this).css(e.prefix + "transition-delay");
				c(this).css(e.prefixCSS(e.prefix, e.transitionProperties))
			})
		},
		startAutoPlay: function(f) {
			var e = this;
			var f = (f === undefined) ? e.settings.autoPlayDelay : f;
			e.unpause();
			e.resetAutoPlay();
			e.autoPlayTimer = setTimeout(function() {
				e.settings.autoPlayDirection === 1 ? e.next() : e.prev()
			}, f)
		},
		stopAutoPlay: function() {
			var e = this;
			e.pause(true);
			clearTimeout(e.autoPlayTimer)
		},
		resetAutoPlay: function(g, f) {
			var e = this;
			if (g === true) {
				if (e.settings.autoPlay && !e.isPaused) {
					clearTimeout(e.autoPlayTimer);
					e.autoPlayTimer = setTimeout(function() {
						e.settings.autoPlayDirection === 1 ? e.next() : e.prev()
					}, f)
				}
			} else {
				clearTimeout(e.autoPlayTimer)
			}
		},
		pause: function(f) {
			var e = this;
			if (!e.isPaused) {
				if (e.pauseButton !== undefined) {
					e.pauseButton.addClass("paused");
					if (e.pauseIcon !== undefined) {
						e.pauseIcon.show()
					}
				}
				e.paused();
				e.isPaused = true;
				e.isHardPaused = (f) ? true : false;
				e.resetAutoPlay()
			} else {
				e.unpause()
			}
		},
		unpause: function(f) {
			var e = this;
			if (e.pauseButton !== undefined) {
				e.pauseButton.removeClass("paused");
				if (e.pauseIcon !== undefined) {
					e.pauseIcon.hide()
				}
			}
			e.isPaused = false;
			e.isHardPaused = false;
			if (!e.active) {
				if (f !== false) {
					e.unpaused()
				}
				e.resetAutoPlay(true, e.settings.unpauseDelay)
			} else {
				e.delayUnpause = true
			}
		},
		next: function() {
			var e = this;
			e.nextFrameID = (e.currentFrameID !== e.numberOfFrames) ? e.currentFrameID + 1 : 1;
			e.goTo(e.nextFrameID, 1)
		},
		prev: function() {
			var e = this;
			e.nextFrameID = (e.currentFrameID === 1) ? e.numberOfFrames : e.currentFrameID - 1;
			e.goTo(e.nextFrameID, -1)
		},
		goTo: function(k, i) {
			var h = this;
			var k = parseFloat(k);
			if ((k === h.currentFrameID) || (h.settings.navigationSkip && h.navigationSkipThresholdActive) || (!h.settings.navigationSkip && h.active) || (!h.transitionsSupported && h.active) || (!h.settings.cycle && i === 1 && h.currentFrameID === h.numberOfFrames) || (!h.settings.cycle && i === -1 && h.currentFrameID === 1) || (h.settings.preventReverseSkipping && h.direction !== i && h.active)) {
				return false
			} else {
				if (h.settings.navigationSkip && h.active) {
					h.navigationSkipThresholdActive = true;
					if (h.settings.fadeFrameWhenSkipped) {
						h.nextFrame.stop().animate({
							opacity: 0
						}, h.settings.fadeFrameTime)
					}
					navigationSkipThresholdTimer = setTimeout(function() {
						h.navigationSkipThresholdActive = false
					}, h.settings.navigationSkipThreshold)
				}
			}
			if (!h.active || h.settings.navigationSkip) {
				h.active = true;
				h.resetAutoPlay();
				if (k === h.numberOfFrames) {
					h.beforeLastFrameAnimatesIn()
				} else {
					if (k === 1) {
						h.beforeFirstFrameAnimatesIn()
					}
				}
				if (i === undefined) {
					h.direction = (k > h.currentFrameID) ? 1 : -1
				} else {
					h.direction = i
				}
				h.currentFrame = h.sequence.children(".animate-in");
				h.nextFrame = h.sequence.children("li:nth-child(" + k + ")");
				h.frameChildren = h.currentFrame.children();
				h.nextFrameChildren = h.nextFrame.children();
				if (h.transitionsSupported) {
					if (h.currentFrame.length !== undefined) {
						h.beforeCurrentFrameAnimatesOut();
						if (h.settings.moveActiveFrameToTop) {
							h.currentFrame.css("z-index", 1)
						}
						h.modifyElements(h.nextFrameChildren, "0s");
						if (!h.settings.reverseAnimationsWhenNavigatingBackwards || h.direction === 1) {
							h.nextFrame.removeClass("animate-out");
							h.modifyElements(h.frameChildren, "")
						} else {
							if (h.settings.reverseAnimationsWhenNavigatingBackwards && h.direction === -1) {
								h.nextFrame.addClass("animate-out");
								h.setTransitionProperties(h.frameChildren)
							}
						}
					} else {
						h.firstFrame = false
					}
					h.active = true;
					h.currentFrame.unbind(h.transitionEnd);
					h.nextFrame.unbind(h.transitionEnd);
					if (h.settings.fadeFrameWhenSkipped) {
						h.nextFrame.css("opacity", 1)
					}
					h.beforeNextFrameAnimatesIn();
					if (h.settings.moveActiveFrameToTop) {
						h.nextFrame.css({
							"z-index": h.numberOfFrames
						})
					}
					if (!h.settings.reverseAnimationsWhenNavigatingBackwards || h.direction === 1) {
						setTimeout(function() {
							h.modifyElements(h.nextFrameChildren, "");
							h.waitForAnimationsToComplete(h.nextFrame, h.nextFrameChildren, "in");
							if (h.afterCurrentFrameAnimatesOut !== "function () {}") {
								h.waitForAnimationsToComplete(h.currentFrame, h.frameChildren, "out")
							}
						}, 50)
					} else {
						if (h.settings.reverseAnimationsWhenNavigatingBackwards && h.direction === -1) {
							setTimeout(function() {
								h.modifyElements(h.nextFrameChildren, "");
								h.setTransitionProperties(h.frameChildren);
								h.waitForAnimationsToComplete(h.nextFrame, h.nextFrameChildren, "in");
								if (h.afterCurrentFrameAnimatesOut != "function () {}") {
									h.waitForAnimationsToComplete(h.currentFrame, h.frameChildren, "out")
								}
							}, 50)
						}
					}
					if (!h.settings.reverseAnimationsWhenNavigatingBackwards || h.direction === 1) {
						setTimeout(function() {
							h.currentFrame.toggleClass("animate-out animate-in");
							h.nextFrame.addClass("animate-in")
						}, 50)
					} else {
						if (h.settings.reverseAnimationsWhenNavigatingBackwards && h.direction === -1) {
							setTimeout(function() {
								h.nextFrame.toggleClass("animate-out animate-in");
								h.currentFrame.removeClass("animate-in")
							}, 50)
						}
					}
				} else {
					function e() {
						h.setHashTag();
						h.active = false;
						h.resetAutoPlay(true, h.settings.autoPlayDelay)
					}
					h.beforeCurrentFrameAnimatesOut();
					switch (h.settings.fallback.theme) {
					case "fade":
						h.sequence.children("li").css({
							position: "relative"
						});
						h.currentFrame.animate({
							opacity: 0
						}, h.settings.fallback.speed, function() {
							h.currentFrame.css({
								display: "none",
								"z-index": "1"
							});
							h.beforeNextFrameAnimatesIn();
							h.nextFrame.css({
								display: "block",
								"z-index": h.numberOfFrames
							}).animate({
								opacity: 1
							}, 500, function() {
								h.afterNextFrameAnimatesIn()
							});
							e()
						});
						h.sequence.children("li").css({
							position: "relative"
						});
						break;
					case "slide":
					default:
						var j = {};
						var g = {};
						var f = {};
						if (h.direction === 1) {
							j.left = "-100%";
							g.left = "100%"
						} else {
							j.left = "100%";
							g.left = "-100%"
						}
						f.left = "0";
						f.opacity = 1;
						h.currentFrame = h.sequence.children("li:nth-child(" + h.currentFrameID + ")");
						h.currentFrame.animate(j, h.settings.fallback.speed);
						h.beforeNextFrameAnimatesIn();
						h.nextFrame.show().css(g);
						h.nextFrame.animate(f, h.settings.fallback.speed, function() {
							e();
							h.afterNextFrameAnimatesIn()
						});
						break
					}
				}
				h.currentFrameID = k
			}
		},
		waitForAnimationsToComplete: function(i, h, g) {
			var f = this;
			if (g === "out") {
				var e = function() {
						f.afterCurrentFrameAnimatesOut()
					}
			} else {
				if (g === "in") {
					var e = function() {
							f.afterNextFrameAnimatesIn();
							f.setHashTag();
							if (f.currentFrameID === f.numberOfFrames) {
								f.afterLastFrameAnimatesIn()
							} else {
								if (f.currentFrameID === 1) {
									f.afterFirstFrameAnimatesIn()
								}
							}
							f.active = false;
							if (!f.isHardPaused && !f.mouseover) {
								if (!f.delayUnpause) {
									f.unpause(false)
								} else {
									f.delayUnpause = false;
									f.unpause()
								}
							}
						}
				}
			}
			h.data("animationEnded", false);
			i.bind(f.transitionEnd, function(k) {
				c(k.target).data("animationEnded", true);
				var j = true;
				h.each(function() {
					if (c(this).data("animationEnded") === false) {
						j = false;
						return false
					}
				});
				if (j) {
					i.unbind(f.transitionEnd);
					e()
				}
			})
		},
		setHashTag: function() {
			var e = this;
			if (e.settings.hashTags) {
				e.currentHashTag = e.nextFrame.attr(e.getHashTagFrom);
				e.frameHashIndex = c.inArray(e.currentHashTag, e.frameHashID);
				if (e.frameHashIndex !== -1 && (e.settings.hashChangesOnFirstFrame || (!e.firstFrame || !e.transitionsSupported))) {
					e.nextFrameID = e.frameHashIndex + 1;
					document.location.hash = "#" + e.currentHashTag
				} else {
					e.nextFrameID = e.settings.startingFrameID;
					e.firstFrame = false
				}
			}
		}
	};
	c.fn.sequence = function(f) {
		var e = this;
		return e.each(function() {
			var g = new a(c(this), f, d, b);
			c(this).data("sequence", g)
		})
	};
	var b = {
		modernizr: function() {
			window.Modernizr = function(aj, ai, ah) {
				function H(e) {
					ab.cssText = e
				}
				function G(f, e) {
					return H(prefixes.join(f + ";") + (e || ""))
				}
				function F(f, e) {
					return typeof f === e
				}
				function U(f, e) {
					return !!~ ("" + f).indexOf(e)
				}
				function S(g, f) {
					for (var i in g) {
						var h = g[i];
						if (!U(h, "-") && ab[h] !== ah) {
							return f == "pfx" ? h : !0
						}
					}
					return !1
				}
				function Q(h, g, k) {
					for (var j in h) {
						var i = g[h[j]];
						if (i !== ah) {
							return k === !1 ? h[j] : F(i, "function") ? i.bind(k || g) : i
						}
					}
					return !1
				}
				function O(g, f, j) {
					var i = g.charAt(0).toUpperCase() + g.slice(1),
						h = (g + " " + X.join(i + " ") + i).split(" ");
					return F(f, "string") || F(f, "undefined") ? S(h, f) : (h = (g + " " + W.join(i + " ") + i).split(" "), Q(h, f, j))
				}
				var ag = "2.6.1",
					af = {},
					ae = ai.documentElement,
					ad = "modernizr",
					ac = ai.createElement(ad),
					ab = ac.style,
					aa, Z = {}.toString,
					Y = "Webkit Moz O ms",
					X = Y.split(" "),
					W = Y.toLowerCase().split(" "),
					V = {
						svg: "http://www.w3.org/2000/svg"
					},
					T = {},
					R = {},
					P = {},
					N = [],
					M = N.slice,
					K, J = {}.hasOwnProperty,
					I;
				!F(J, "undefined") && !F(J.call, "undefined") ? I = function(f, e) {
					return J.call(f, e)
				} : I = function(f, e) {
					return e in f && F(f.constructor.prototype[e], "undefined")
				}, Function.prototype.bind || (Function.prototype.bind = function(f) {
					var i = self;
					if (typeof i != "function") {
						throw new TypeError
					}
					var h = M.call(arguments, 1),
						g = function() {
							if (self instanceof g) {
								var e = function() {};
								e.prototype = i.prototype;
								var k = new e,
									j = i.apply(k, h.concat(M.call(arguments)));
								return Object(j) === j ? j : k
							}
							return i.apply(f, h.concat(M.call(arguments)))
						};
					return g
				}), T.svg = function() {
					return !!ai.createElementNS && !! ai.createElementNS(V.svg, "svg").createSVGRect
				};
				for (var L in T) {
					I(T, L) && (K = L.toLowerCase(), af[K] = T[L](), N.push((af[K] ? "" : "no-") + K))
				}
				return af.addTest = function(f, e) {
					if (typeof f == "object") {
						for (var g in f) {
							I(f, g) && af.addTest(g, f[g])
						}
					} else {
						f = f.toLowerCase();
						if (af[f] !== ah) {
							return af
						}
						e = typeof e == "function" ? e() : e, enableClasses && (ae.className += " " + (e ? "" : "no-") + f), af[f] = e
					}
					return af
				}, H(""), ac = aa = null, af._version = ag, af._domPrefixes = W, af._cssomPrefixes = X, af.testProp = function(e) {
					return S([e])
				}, af.testAllProps = O, af.prefixed = function(f, e, g) {
					return e ? O(f, e, g) : O(f, "pfx")
				}, af
			}(self, self.document)
		},
		defaultPreloader: function(h, g, f) {
			var e = '<div class="sequence-preloader"><svg class="preloading" xmlns="http://www.w3.org/2000/svg"><circle class="circle" cx="6" cy="6" r="6" /><circle class="circle" cx="22" cy="6" r="6" /><circle class="circle" cx="38" cy="6" r="6" /></svg></div>';
			c("head").append("<style>.sequence-preloader{height: 100%;position: absolute;width: 100%;z-index: 999999;}@" + f + "keyframes preload{0%{opacity: 1;}50%{opacity: 0;}100%{opacity: 1;}}.sequence-preloader .preloading .circle{fill: #ff9442;display: inline-block;height: 12px;position: relative;top: -50%;width: 12px;" + f + "animation: preload 1s infinite; animation: preload 1s infinite;}.preloading{display:block;height: 12px;margin: 0 auto;top: 50%;margin-top:-6px;position: relative;width: 48px;}.sequence-preloader .preloading .circle:nth-child(2){" + f + "animation-delay: .15s; animation-delay: .15s;}.sequence-preloader .preloading .circle:nth-child(3){" + f + "animation-delay: .3s; animation-delay: .3s;}.preloading-complete{opacity: 0;visibility: hidden;" + f + "transition-duration: 1s; transition-duration: 1s;}div.inline{background-color: #ff9442; margin-right: 4px; float: left;}</style>");
			h.prepend(e);
			if (!Modernizr.svg && !g) {
				c(".sequence-preloader").prepend('<div class="preloading"><div class="circle inline"></div><div class="circle inline"></div><div class="circle inline"></div></div>');
				setInterval(function() {
					c(".sequence-preloader .circle").fadeToggle(500)
				}, 500)
			} else {
				if (!g) {
					setInterval(function() {
						c(".sequence-preloader").fadeToggle(500)
					}, 500)
				}
			}
		},
		operaTest: function() {
			c("body").append('<span id="sequence-opera-test"></span>');
			var e = c("#sequence-opera-test");
			e.css("-o-transition", "1s");
			if (e.css("-o-transition") != "1s") {
				return false
			} else {
				return true
			}
			e.remove()
		}
	};
	var d = {
		startingFrameID: 1,
		cycle: true,
		animateStartingFrameIn: false,
		reverseAnimationsWhenNavigatingBackwards: true,
		moveActiveFrameToTop: true,
		autoPlay: true,
		autoPlayDirection: 1,
		autoPlayDelay: 5000,
		navigationSkip: true,
		navigationSkipThreshold: 250,
		fadeFrameWhenSkipped: true,
		fadeFrameTime: 150,
		preventReverseSkipping: false,
		nextButton: false,
		showNextButtonOnInit: true,
		prevButton: false,
		showPrevButtonOnInit: true,
		pauseButton: false,
		unpauseDelay: null,
		pauseOnHover: true,
		pauseIcon: false,
		preloader: false,
		preloadTheseFrames: [1],
		preloadTheseImages: [],
		hideFramesUntilPreloaded: true,
		prependPreloadingComplete: true,
		hidePreloaderUsingCSS: true,
		hidePreloaderDelay: 0,
		keyNavigation: true,
		numericKeysGoToFrames: true,
		keyEvents: {
			left: "prev",
			right: "next"
		},
		customKeyEvents: {},
		swipeNavigation: true,
		swipeThreshold: 20,
		swipePreventsDefault: false,
		swipeEvents: {
			left: "prev",
			right: "next",
			up: false,
			down: false
		},
		hashTags: false,
		hashDataAttribute: false,
		hashChangesOnFirstFrame: false,
		fallback: {
			theme: "slide",
			speed: 500
		}
	}
})(jQuery);
(function(g, e) {
	var c = "auto";
	var b = e(window);
	var d = false;
	var i = {
		nextButton: ".next",
		prevButton: ".prev",
		autoPlay: true,
		autoPlayDelay: 8500,
		pauseOnHover: true,
		moveActiveFrameToTop: false,
		fadeFrameWhenSkipped: false,
		animateStartingFrameIn: true,
		reverseAnimationsWhenNavigatingBackwards: true,
		preventDelayWhenReversingAnimations: true,
		swipeEvents: {
			left: "next",
			right: "prev",
			up: false,
			down: false
		}
	};
	var h = e("#slideshow").sequence(i).data("sequence");
	if (b.width() >= 1000) {
		d = true;
		e("#slideshow").addClass("on");
		h.startAutoPlay()
	}
	b.resize(function() {
		clearTimeout(this.resizeTimeoutId);
		this.resizeTimeoutId = setTimeout(f, 200)
	});

	function f() {
		if (b.width() >= 1000) {
			d = true;
			e("#slideshow").addClass("on");
			h.startAutoPlay()
		} else {
			d = false;
			e("#slideshow").removeClass("on");
			h.stopAutoPlay()
		}
	}
	e(f);
	var a = function() {
			if (g._gaq) {
				window._gaq.push(["_trackEvent", "mozilla15 SlideShow", c, h.nextFrame[0].id])
			}
			c = "auto"
		};
	h.afterNextFrameAnimatesIn = function() {
		a()
	};
	e(".next, .prev").on("click", function(j) {
		j.preventDefault();
		c = "click"
	});
	e(document).on("keydown", function(k) {
		var j = k.keyCode;
		if (j === 39 || j === 37) {
			c = "keydown"
		}
	})
})(window, jQuery);
$(document).ready(function() {
	function d() {
		var f = {};
		window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(g, h, i) {
			f[h] = i
		});
		return f
	}
	function c(g, f) {
		for (var i in f) {
			var h = new RegExp(f[i]);
			if (h.test(g)) {
				return true
			}
		}
		return false
	}
	var e = $("#opportunities");

	function b(f) {
		var g = f.offset().top;
		$("html:not(:animated),body:not(:animated)").animate({
			scrollTop: g - 20
		}, 100)
	}
	var a = Mozilla.Pager.rootPagers[0];
	$("#interest-header").click(function(f) {
		f.preventDefault();
		a.setPageWithAnimation(a.pagesById.interest);
		b(e)
	});
	$("#location-header").click(function(f) {
		f.preventDefault();
		a.setPageWithAnimation(a.pagesById.location);
		b(e)
	});
	$("#time-header").click(function(f) {
		f.preventDefault();
		a.setPageWithAnimation(a.pagesById.time);
		b(e)
	});
	$("#help-form").submit(function(f) {
		$(this).unbind("submit");
		f.preventDefault();
		callback_url = d()["callbackurl"];
		trusted_domains = ["^https://reps.mozilla.org/", "^https://reps.allizom.org/", "^https://reps-dev.allizom.org/", "^http://127.0.0.1:8000/"];
		if (callback_url && c(callback_url, trusted_domains)) {
			$("#form-content").hide();
			$("#submit-wait").show();
			$.post(callback_url).complete(function() {
				$("#help-form").submit()
			})
		} else {
			$(this).submit()
		}
	});
	$("#thank-you").delay(8500).fadeOut("fast", function() {
		$("#form-content").fadeIn("fast")
	})
});
$(document).ready(function() {
	$.extend($.easing, {
		pagerFadeIn: function(f, g, e, i, h) {
			return i * (g /= h) * g + e
		},
		pagerFadeOut: function(f, g, e, i, h) {
			return -i * (g /= h) * (g - 2) + e
		}
	});
	Mozilla.Pager.createPagers(document.body, Mozilla.Pager.rootPagers, null);
	for (var a = 0; a < Mozilla.Pager.rootPagers.length; a++) {
		if (Mozilla.Pager.rootPagers[a].history) {
			setInterval(Mozilla.Pager.checkLocation, Mozilla.Pager.LOCATION_INTERVAL);
			break
		}
	}
});
if (typeof Mozilla == "undefined") {
	var Mozilla = {}
}
Mozilla.Pager = function(b, a) {
	this.$container = $(b);
	if (!b.id) {
		b.id = "mozilla-pager-" + Mozilla.Pager.currentId;
		Mozilla.Pager.currentId++
	}
	var p = this.$container.find("div.pager-content");
	if (!p.length) {
		return
	}
	this.$pageContainer = $(p[0]);
	this.id = b.id;
	this.pagesById = {};
	this.pages = [];
	this.previousPage = null;
	this.currentPage = null;
	this.animatingOut = false;
	this.childPagers = {};
	this.parentPager = a;
	this.randomStartPage = (this.$container.hasClass("pager-random"));
	if (this.$container.hasClass("pager-with-tabs")) {
		var k = this.$container.find("ul.pager-tabs");
		if (k.length) {
			this.$tabs = $(k[0])
		} else {
			this.$tabs = null
		}
	} else {
		this.$tabs = null
	}
	if (this.$container.hasClass("pager-with-nav")) {
		this.drawNav()
	} else {
		this.$nav = null
	}
	this.history = (!this.$container.hasClass("pager-no-history"));
	this.hideWithHiddenClass = this.$container.hasClass("pager-with-hidden-class");
	this.cleartypeFix = (this.$container.hasClass("pager-cleartype-fix"));
	var l;
	var o = this.$pageContainer.children("div");
	if (this.$tabs) {
		var m = this.$tabs.children().not(".pager-not-tab");
		var j = 0;
		for (var f = 0; f < o.length; f++) {
			if (f < m.length) {
				var n = $(m[f]).children("a:first");
				if (n.length) {
					l = new Mozilla.Page(o[f], j, n[0], this.hideWithHiddenClass);
					this.addPage(l);
					this.childPagers[l.id] = [];
					Mozilla.Pager.createPagers(l.el, this.childPagers[l.id], this);
					j++
				}
			}
		}
	} else {
		for (var f = 0; f < o.length; f++) {
			l = new Mozilla.Page(o[f], f, false, this.hideWithHiddenClass);
			this.addPage(l);
			this.childPagers[l.id] = [];
			Mozilla.Pager.createPagers(l.el, this.childPagers[l.id], this)
		}
	}
	var g;
	if (this.history && !this.parentPager) {
		var e = location.hash;
		e = (e.substring(0, 1) == "#") ? e.substring(1) : e;
		e = e.replace(/(^\/|\/$)/g, "");
		if (e.length) {
			this.setStateFromPath(e, false, false);
			g = this.currentPage
		}
	}
	if (!g && this.pages.length > 0) {
		if (this.randomStartPage) {
			this.setPage(this.getPseudoRandomPage())
		} else {
			var c = this.$pageContainer.children(".default-page:first");
			if (c.length) {
				var d;
				if (c[0].id.substring(0, 5) == "page-") {
					d = c[0].id.substring(5)
				} else {
					d = c[0].id
				}
				this.setPage(this.pagesById[d])
			} else {
				this.setPage(this.pages[0])
			}
		}
	}
	if (this.$container.hasClass("pager-auto-rotate")) {
		var h = this;
		this.autoRotate = true;
		this.startAutoRotate();
		this.$container.hover(function(i) {
			h.stopAutoRotate()
		}, function(i) {
			if (h.autoRotate) {
				h.startAutoRotate()
			}
		});
		this.$container.focusin(function(i) {
			h.stopAutoRotate()
		}).focusout(function(i) {
			if (h.autoRotate) {
				h.startAutoRotate()
			}
		})
	} else {
		this.autoRotate = false
	}
	Mozilla.Pager.pagers[this.id] = this
};
Mozilla.Pager.currentId = 1;
Mozilla.Pager.pagers = {};
Mozilla.Pager.rootPagers = [];
Mozilla.Pager.createPagers = function(e, c, b) {
	if (/(^pager$|^pager | pager$| pager )/.test(e.className)) {
		var a = new Mozilla.Pager(e, b);
		c.push(a)
	} else {
		for (var d = 0; d < e.childNodes.length; d++) {
			if (e.nodeType == 1) {
				Mozilla.Pager.createPagers(e.childNodes[d], c, b)
			}
		}
	}
};
Mozilla.Pager.checkLocation = function() {
	var c = location.hash;
	c = (c.substring(0, 1) == "#") ? c.substring(1) : c;
	c = c.replace(/(^\/|\/$)/g, "");
	var a;
	for (var b = 0; b < Mozilla.Pager.rootPagers.length; b++) {
		a = Mozilla.Pager.rootPagers[b];
		if (a.history) {
			a.setStateFromPath(c, true, true)
		}
	}
};
Mozilla.Pager.prototype.getPseudoRandomPage = function() {
	var b = null;
	if (this.pages.length > 0) {
		var a = new Date();
		b = this.pages[a.getSeconds() % this.pages.length]
	}
	return b
};
Mozilla.Pager.PAGE_DURATION = 150;
Mozilla.Pager.PAGE_AUTO_DURATION = 850;
Mozilla.Pager.LOCATION_INTERVAL = 200;
Mozilla.Pager.NEXT_TEXT = "Next";
Mozilla.Pager.PREV_TEXT = "Previous";
Mozilla.Pager.PAGE_NUMBER_TEXT = "%s / %s";
Mozilla.Pager.AUTO_ROTATE_INTERVAL = 7000;
Mozilla.Pager.prototype.setStateFromPath = function(k, b, l) {
	var a = k,
		h = a.indexOf("/");
	if (h !== -1) {
		a = a.substr(0, h);
		k = k.substr(h + 1)
	}
	var f = a.split("+"),
		c, g;
	for (var e = 0; e < f.length; e++) {
		a = f[e];
		g = this.pagesById[a];
		c = (this.currentPage === null || a !== this.currentPage.id);
		if (g) {
			if (c) {
				if (b) {
					this.setPageWithAnimation(g, Mozilla.Pager.PAGE_DURATION)
				} else {
					this.setPage(g)
				}
			}
			for (var d = 0; d < this.childPagers[a].length; d++) {
				this.childPagers[a][d].setStateFromPath(k, b, l)
			}
			if (c && l) {
				this.currentPage.focusTab()
			}
			break
		}
	}
};
Mozilla.Pager.prototype.prevPageWithAnimation = function(b) {
	var a = this.currentPage.index - 1;
	if (a < 0) {
		a = this.pages.length - 1
	}
	this.setPageWithAnimation(this.pages[a], b)
};
Mozilla.Pager.prototype.nextPageWithAnimation = function(b) {
	var a = this.currentPage.index + 1;
	if (a >= this.pages.length) {
		a = 0
	}
	this.setPageWithAnimation(this.pages[a], b)
};
Mozilla.Pager.prototype.drawNav = function() {
	var b = this;
	this.$nav = $('<div class="pager-nav">');
	this.$pageNumber = $('<span class="pager-nav-page-number">');
	this.$pageNumber.appendTo(this.$nav);
	this.$prevInsensitive = $('<span class="pager-prev-insensitive">');
	this.$prevInsensitive.css("display", "none").appendTo(this.$nav);
	this.$prev = $('<a href="#" class="pager-prev" title="' + Mozilla.Pager.PREV_TEXT + '"></a>');
	this.$prev.click(function(c) {
		c.preventDefault();
		b.prevPageWithAnimation(Mozilla.Pager.PAGE_DURATION);
		b.autoRotate = false;
		b.stopAutoRotate()
	}).dblclick(function(c) {
		c.preventDefault()
	}).appendTo(this.$nav);
	var a = $('<span class="pager-nav-divider">|</span>');
	a.appendTo(this.$nav);
	this.$next = $('<a href="#" class="pager-next" title="' + Mozilla.Pager.NEXT_TEXT + '"></a>');
	this.$next.click(function(c) {
		c.preventDefault();
		b.nextPageWithAnimation(Mozilla.Pager.PAGE_DURATION);
		b.autoRotate = false;
		b.stopAutoRotate()
	}).dblclick(function(c) {
		c.preventDefault()
	}).appendTo(this.$nav);
	this.$nextInsensitive = $('<span class="pager-next-insensitive">');
	this.$nextInsensitive.css("display", "none").appendTo(this.$nav);
	this.$nav.insertBefore(this.$pageContainer)
};
Mozilla.Pager.prototype.updateLocation = function(d) {
	if (!this.history) {
		return
	}
	var c = location.href.split("#")[0];
	var e = d.id;
	var a = this;
	while (a.parentPager !== null) {
		e = a.parentPager.currentPage.id + "/" + e;
		a = a.parentPager
	}
	if (this.childPagers[d.id] && this.childPagers[d.id].length) {
		e += "/";
		for (var b = 0; b < this.childPagers[d.id].length; b++) {
			e += this.childPagers[d.id][b].currentPage.id + "+"
		}
		e = e.substr(0, e.length - 1)
	}
	location.href = c + "#" + e
};
Mozilla.Pager.prototype.addPage = function(b) {
	var a = this;
	this.pagesById[b.id] = b;
	this.pages.push(b);
	if (b.tab) {
		b.$tab.click(function(c) {
			c.preventDefault();
			a.setPageWithAnimation(b, Mozilla.Pager.PAGE_DURATION);
			a.autoRotate = false;
			a.stopAutoRotate()
		})
	}
	b.$el.find("*").focus(function(c) {
		if (b.$el.hasClass("hidden")) {
			a.setPage(b);
			a.autoRotate = false;
			a.stopAutoRotate()
		}
	})
};
Mozilla.Pager.prototype.update = function() {
	if (this.$tabs) {
		this.updateTabs()
	}
	if (this.$nav) {
		this.updateNav()
	}
	var b = this.$pageContainer.get(0);
	var a = b.className;
	a = a.replace(/pager-selected-[\w-]+/g, "");
	a = a.replace(/^\s+|\s+$/g, "");
	b.className = a;
	this.$pageContainer.addClass("pager-selected-" + this.currentPage.id)
};
Mozilla.Pager.prototype.updateTabs = function() {
	var b = this.$tabs.get(0);
	var a = b.className;
	a = a.replace(/pager-selected-[\w-]+/g, "");
	a = a.replace(/^\s+|\s+$/g, "");
	b.className = a;
	this.currentPage.selectTab();
	this.$container.trigger("changePage", [this.currentPage.tab]);
	this.$tabs.addClass("pager-selected-" + this.currentPage.id)
};
Mozilla.Pager.prototype.updateNav = function() {
	var a = this.currentPage.index + 1;
	var b = this.pages.length;
	var c = Mozilla.Pager.PAGE_NUMBER_TEXT.replace(/%s/, a);
	c = c.replace(/%s/, b);
	this.$pageNumber.text(c);
	this.setPrevSensitivity(this.currentPage.index != 0);
	this.setNextSensitivity(this.currentPage.index != this.pages.length - 1)
};
Mozilla.Pager.prototype.setPrevSensitivity = function(a) {
	if (a) {
		this.$prevInsensitive.css("display", "none");
		this.$prev.css("display", "inline")
	} else {
		this.$prevInsensitive.css("display", "inline");
		this.$prev.css("display", "none")
	}
};
Mozilla.Pager.prototype.setNextSensitivity = function(a) {
	if (a) {
		this.$nextInsensitive.css("display", "none");
		this.$next.css("display", "inline")
	} else {
		this.$nextInsensitive.css("display", "inline");
		this.$next.css("display", "none")
	}
};
Mozilla.Pager.prototype.setPage = function(a) {
	if (this.currentPage !== a) {
		if (this.currentPage) {
			this.currentPage.deselectTab();
			this.currentPage.hide(this.hideWithHiddenClass)
		}
		if (this.previousPage) {
			this.previousPage.hide(this.hideWithHiddenClass)
		}
		this.previousPage = this.currentPage;
		this.currentPage = a;
		this.currentPage.show(this.hideWithHiddenClass);
		this.update()
	}
};
Mozilla.Pager.prototype.setPageWithAnimation = function(c, d) {
	if (this.currentPage !== c) {
		this.updateLocation(c);
		if (this.currentPage) {
			this.currentPage.deselectTab()
		}
		if (!this.animatingOut) {
			if (this.$pageContainer.is(":animated")) {
				var a = parseFloat(this.$pageContainer.css("opacity"));
				d = a * Mozilla.Pager.PAGE_DURATION;
				this.$pageContainer.stop(true, false)
			}
			this.previousPage = this.currentPage;
			this.animatingOut = true;
			this.currentPage = c;
			var b = this;
			this.$pageContainer.animate({
				opacity: 0
			}, d, "pagerFadeOut", function() {
				b.fadeInPage(d)
			})
		} else {
			this.currentPage = c
		}
		this.update()
	}
	return false
};
Mozilla.Pager.prototype.fadeInPage = function(b) {
	if (this.previousPage) {
		this.previousPage.hide(this.hideWithHiddenClass)
	}
	this.currentPage.show(this.hideWithHiddenClass);
	this.animatingOut = false;
	var a = this;
	this.$pageContainer.animate({
		opacity: 1
	}, b, "pagerFadeOut", function() {
		if (a.cleartypeFix && $.browser.msie) {
			this.style.removeAttribute("filter")
		}
	})
};
Mozilla.Pager.prototype.stopAutoRotate = function() {
	if (this.autoRotateInterval) {
		clearInterval(this.autoRotateInterval);
		this.autoRotateInterval = null
	}
};
Mozilla.Pager.prototype.startAutoRotate = function() {
	var a = function(b) {
			var c = function() {
					b.nextPageWithAnimation(Mozilla.Pager.PAGE_AUTO_DURATION)
				};
			b.autoRotateInterval = setInterval(c, Mozilla.Pager.AUTO_ROTATE_INTERVAL, b)
		};
	if (!this.autoRotateInterval) {
		a(this)
	}
};
Mozilla.Page = function(d, b, c, a) {
	this.el = d;
	if (!this.el.id) {
		this.el.id = "mozilla-pager-page-" + Mozilla.Page.currentId;
		Mozilla.Page.currentId++
	}
	if (this.el.id.substring(0, 5) == "page-") {
		this.id = this.el.id.substring(5)
	} else {
		this.id = this.el.id
	}
	this.el.id = "page-" + this.id;
	this.index = b;
	if (c) {
		this.tab = c;
		this.tab.href = "#" + this.id;
		this.$tab = $(this.tab)
	} else {
		this.tab = null
	}
	this.$el = $(this.el);
	this.hide(a)
};
Mozilla.Page.currentId = 1;
Mozilla.Page.prototype.selectTab = function() {
	if (this.tab) {
		this.$tab.addClass("selected")
	}
};
Mozilla.Page.prototype.deselectTab = function() {
	if (this.tab) {
		this.$tab.removeClass("selected")
	}
};
Mozilla.Page.prototype.focusTab = function() {
	if (this.tab) {
		this.tab.focus()
	}
};
Mozilla.Page.prototype.hide = function(a) {
	if (a) {
		this.$el.addClass("hidden")
	} else {
		this.el.style.display = "none"
	}
};
Mozilla.Page.prototype.show = function(a) {
	if (a) {
		this.$el.removeClass("hidden")
	} else {
		this.el.style.display = "block"
	}
};
if (typeof Mozilla == "undefined") {
	var Mozilla = {}
}
$(document).ready(function() {
	$(".mozilla-video-control").each(function() {
		Mozilla.VideoControl.controls.push(new Mozilla.VideoControl($(this)))
	})
});
Mozilla.VideoControl = function(a) {
	if (typeof a == "String") {
		a = $("#" + a)
	}
	this.container = a;
	var c = a.find("video:first");
	var b = c.attr("preload");
	if (!b || b == "none") {
		c.attr("preload", "metadata")
	}
	this.video = c;
	this._video = this.video[0];
	this.semaphore = false;
	if (typeof HTMLMediaElement != "undefined" && this._video instanceof HTMLMediaElement) {
		this.drawControl();
		this._video._control = this
	}
};
Mozilla.VideoControl.controls = [];
Mozilla.VideoControl.prototype.drawControl = function() {
	var c = $(this._video).data("overlay-hidden-text");
	if (!c) {
		c = "Play video"
	}
	var b = '<a href="#" role="button" class="mozilla-video-control-overlay" style="opacity: 0"><span class="hidden">' + c + "</span></a>";
	this.control = $(b);
	if (this._video.paused || this._video.ended) {
		this.show()
	}
	var a = this;
	this.video.bind("play playing seeking waiting", function(d) {
		a.hide()
	});
	this.control.mouseover(function(d) {
		if (!a.semaphore) {
			a.prelight()
		}
	});
	this.control.mouseout(function(d) {
		if (!a.semaphore) {
			a.unprelight()
		}
	});
	this.control.click(function(d) {
		d.preventDefault();
		if (a.semaphore || !a.videoCanPlay()) {
			return
		}
		a.semaphore = true;
		if (a._video.ended) {
			a._video.currentTime = 0
		}
		a._video.play()
	});
	this.container.append(this.control)
};
Mozilla.VideoControl.prototype.videoCanPlay = function() {
	var a = (typeof HTMLMediaElement.CAN_PLAY == "undefined") ? HTMLMediaElement.HAVE_CURRENT_DATA : HTMLMediaElement.CAN_PLAY;
	return (this._video.readyState >= a)
};
Mozilla.VideoControl.prototype.show = function() {
	var a = this;
	this._video.controls = false;
	this.control.css("display", "block");
	this.control.stop(true).fadeTo("slow", 0.7, function() {
		a.semaphore = false
	})
};
Mozilla.VideoControl.prototype.hide = function() {
	var a = this;
	if (this.control.is(":visible")) {
		this.semaphore = true;
		this.control.stop(true).fadeTo("fast", 0, function() {
			$(this).hide();
			a._video.controls = true
		})
	}
};
Mozilla.VideoControl.prototype.prelight = function() {
	if (this.control.is(":visible")) {
		this.control.stop(true).fadeTo("fast", 1)
	}
};
Mozilla.VideoControl.prototype.unprelight = function() {
	if (this.control.is(":visible")) {
		this.control.stop(true).fadeTo("fast", 0.7)
	}
};
Mozilla.VideoPlayer = function(f, b, a, e, c) {
	this.id = f;
	this.flv_url = a;
	this.sources = b;
	this.opened = false;
	if (arguments.length > 3) {
		this.autoplay = e
	} else {
		this.autoplay = true
	}
	if (arguments.length > 4) {
		this.extra_content = c
	} else {
		this.extra_content = ""
	}
	var d = this;
	$(document).ready(function() {
		d.init()
	})
};
Mozilla.VideoPlayer.height = 385;
Mozilla.VideoPlayer.width = 640;
Mozilla.VideoPlayer.ie6 = ($.browser.msie && parseInt($.browser.version, 10) <= 6);
Mozilla.VideoPlayer.close_text = "Close";
Mozilla.VideoPlayer.fallback_text = 'This video requires a browser with support for open video or the <a href="http://get.adobe.com/flashplayer">Adobe Flash Player</a>. Alternatively, you may use the video download links provided.';
Mozilla.VideoPlayer.prototype.init = function() {
	var a = this;
	this.overlay = $('<a class="mozilla-video-player-overlay" href="#"/>').hide().appendTo("body").click(function(b) {
		b.preventDefault();
		a.close()
	});
	this.video_container = $('<div class="mozilla-video-player-window" />').hide().appendTo("body");
	$("#" + this.id + ", #" + this.id + "-preview").click(function(b) {
		b.preventDefault();
		a.open()
	})
};
Mozilla.VideoPlayer.prototype.clearVideoPlayer = function() {
	this.video_container.unbind("click");
	this.video_container.find("video").each(function() {
		$(this)[0].pause()
	});
	this.video_container.empty()
};
Mozilla.VideoPlayer.prototype.drawVideoPlayer = function() {
	var b = this;
	this.clearVideoPlayer();
	if (typeof HTMLMediaElement != "undefined") {
		var a = this.getVideoPlayerContent()
	} else {
		if (Mozilla.VideoPlayer.flash_verison.isValid([7, 0, 0])) {
			var a = this.getFlashPlayerContent()
		} else {
			var a = this.getFallbackContent()
		}
	}
	a += '<div class="video-download-links">';
	if (this.extra_content != "") {
		a += this.extra_content
	}
	a += "<ul>";
	$.each(this.sources, function(c, d) {
		a += '<li><a href="' + d.url + '">' + d.title + "</a></li>"
	});
	a += "</ul></div>";
	this.video_container.append($('<div class="mozilla-video-player-close" />').append($('<a href="#" />').click(function(c) {
		c.preventDefault();
		b.close()
	}).append($('<img src="/img/covehead/video/clothes-lol.png" height="32" width="32" alt="' + Mozilla.VideoPlayer.close_text + '" />')))).append($('<div class="mozilla-video-player-content" />').html(a))
};
Mozilla.VideoPlayer.prototype.getVideoPlayerContent = function() {
	var a = '<video id="htmlPlayer" width="' + Mozilla.VideoPlayer.width + '" height="' + Mozilla.VideoPlayer.height + '" controls="controls"';
	if (this.autoplay) {
		a += ' autoplay="autoplay"'
	}
	a += ">";
	$.each(this.sources, function(b, c) {
		if (!c.type) {
			return
		}
		a += '<source src="' + c.url + '" type="' + c.type + '"/>'
	});
	a += "</video>";
	return a
};
Mozilla.VideoPlayer.prototype.getFlashPlayerContent = function() {
	var a = "/includes/flash/playerWithControls.swf?flv=" + this.flv_url + "&amp;autoplay=";
	a += (this.autoplay) ? "true" : "false";
	var b = '<object type="application/x-shockwave-flash" style="width: ' + Mozilla.VideoPlayer.width + "px; height: " + Mozilla.VideoPlayer.height + 'px;" wmode="transparent" data="' + a + '"><param name="movie" value="' + a + '"><param name="wmode" value="transparent"></object>';
	return b
};
Mozilla.VideoPlayer.prototype.getFallbackContent = function() {
	var a = '<div class="mozilla-video-player-no-flash">' + Mozilla.VideoPlayer.fallback_text + "</div>";
	return a
};
Mozilla.VideoPlayer.prototype.open = function() {
	$("#lang_form").hide();
	if (Mozilla.VideoPlayer.ie6) {
		this.video_container.css("position", "absolute");
		this.overlay.css("position", "absolute")
	}
	var a = this;
	this.resizeHandler = function(b) {
		a.resizeOverlay()
	};
	$(window).resize(this.resizeHandler);
	if (Mozilla.VideoPlayer.ie6) {
		$(window).scroll(this.resizeHandler)
	}
	this.drawVideoPlayer();
	this.resizeOverlay();
	this.overlay.fadeTo(400, 0.75);
	this.video_container.fadeIn();
	this.opened = true;
	if (window.getSubtitles) {
		getSubtitles(this.video_container.css("top"))
	}
};
Mozilla.VideoPlayer.prototype.resizeOverlay = function() {
	if (Mozilla.VideoPlayer.ie6) {
		var d = $(window).scrollTop();
		var c = $(document).height();
		var a = $(window).height();
		var e = 430;
		var b = d + (a + e) / 2;
		if (b > c) {
			this.video_container.css("top", c - e - 10)
		} else {
			this.video_container.css("top", d + (a - e) / 2)
		}
		this.overlay.height(c)
	} else {
		this.video_container.css("top", ($(window).height() - 430) / 2);
		this.overlay.height($(window).height())
	}
};
Mozilla.VideoPlayer.prototype.close = function() {
	if (window.hideSubtitles) {
		hideSubtitles()
	}
	this.overlay.fadeOut();
	this.video_container.fadeOut();
	this.clearVideoPlayer();
	$("#lang_form").show();
	$(window).unbind("resize", this.resizeHandler);
	this.opened = false
};
Mozilla.VideoPlayer.prototype.toggle = function() {
	if (this.opened) {
		this.close()
	} else {
		this.open()
	}
};
Mozilla.VideoPlayer.getFlashVersion = function() {
	var c = new Mozilla.FlashVersion([0, 0, 0]);
	if (navigator.plugins && navigator.mimeTypes.length) {
		var b = navigator.plugins["Shockwave Flash"];
		if (b && b.description) {
			c = b.description.replace(/([a-zA-Z]|\s)+/, "");
			c = c.replace(/(\s+r|\s+b[0-9]+)/, ".");
			c = new Mozilla.FlashVersion(c.split("."))
		}
	} else {
		if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) {
			var d = true;
			var a = 3;
			while (d) {
				try {
					major_version++;
					d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + major_version);
					c = new Mozilla.FlashVersion([major_version, 0, 0])
				} catch (f) {
					d = null
				}
			}
		} else {
			try {
				var d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
			} catch (f) {
				try {
					var d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
					c = new Mozilla.FlashVersion([6, 0, 21]);
					d.AllowScriptAccess = "always"
				} catch (f) {
					if (c.major == 6) {
						return c
					}
				}
				try {
					d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
				} catch (f) {}
			}
			if (d != null) {
				c = new Mozilla.FlashVersion(d.GetVariable("$version").split(" ")[1].split(","))
			}
		}
	}
	return c
};
Mozilla.FlashVersion = function(a) {
	this.major = a[0] != null ? parseInt(a[0]) : 0;
	this.minor = a[1] != null ? parseInt(a[1]) : 0;
	this.rev = a[2] != null ? parseInt(a[2]) : 0
};
Mozilla.FlashVersion.prototype.isValid = function(a) {
	if (a instanceof Array) {
		a = new Mozilla.FlashVersion(a)
	}
	if (this.major < a.major) {
		return false
	}
	if (this.major > a.major) {
		return true
	}
	if (this.minor < a.minor) {
		return false
	}
	if (this.minor > a.minor) {
		return true
	}
	if (this.rev < a.rev) {
		return false
	}
	return true
};
Mozilla.VideoPlayer.flash_verison = Mozilla.VideoPlayer.getFlashVersion();