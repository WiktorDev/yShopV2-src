(function (Comp) {
    Comp.fn.gallery = function(options) {
              
    if (this.length === 0) {
      return this;
    }
              
    var Options = function() {
      if (options) {
        for (var properties in options) {
          this[properties] = options[properties];
        }
      }
    };
  
    Options.prototype = {
      animation: "slide",
      animationPrev: "prev",
      animationNext: "next",
      
      album: false,
      albumClass: ".gallery-album",
      
      mask: "compsoul-gallery-mask",
      maskBefore: "compsoul-gallery-mask-before",
      maskBeforeButton: "compsoul-gallery-mask-before-button",
      content: "compsoul-gallery",
      close: "compsoul-gallery-close",
      closeText: "",
      nav: true,
      prev: "compsoul-gallery-prev",
      prevText: "Poprzedni",
      next: "compsoul-gallery-next",
      nextText: "NastÄpny",
      firstElement: "compsoul-gallery-first-element",
      secondElement: "compsoul-gallery-second-element",
      loader: "compsoul-gallery-loader",
      comment: "gallery-comment",
      
      hiddenScroll : true,
      hiddenScrollClass : "hidden-scroll",
      
      activeNameClass: "active",
      inactiveNameClass: "none",
      errorNameClass: "error",
      prevNameClass: "prev",
      nextNameClass: "next",
      
      parent: false
    };
            
    var gallery = {},
    settings = new Options();
                  
    var self = this,
    len = self.length,
    html = new Comp("html"),
    body = new Comp("body");
  
    gallery.activeFlag = false;
    gallery.loadEvents = true;
    
    gallery.getScrollBar = function() {
      return html.addClass(settings.hiddenScrollClass)[0].clientWidth - html.removeClass(settings.hiddenScrollClass)[0].clientWidth;
    };
  
    gallery.create = function(element, parent) {
      return parent.appendChild(document.createElement(element));
    };
            
    gallery.elementOf = function(element, list) {
      var galleryLen = len;
      while(galleryLen--) {
        if (element === list[galleryLen]) {
          return galleryLen;
        }
      }
      return -1;
    };
            
    gallery.change = function(element, anchor) {
      gallery.resize(element);
      gallery.loader.removeClass(settings.activeNameClass + " " + settings.errorNameClass).addClass(settings.inactiveNameClass);
      element[0].style.backgroundImage = "url(" + element[0].firstChild.getAttribute("src") + ")";
      if (anchor.querySelectorAll("." + settings.comment).length > 0) {
        var clone = anchor.querySelectorAll("." + settings.comment)[0].cloneNode(true);
        element[0].appendChild(clone);
        new Comp(clone).removeClass("hidden");
      }
    };
  
    gallery.request = function(http, callback) {
      var request = new XMLHttpRequest();
      request.open("GET", http, true);
      request.onreadystatechange = function() {
        if ( request.readyState === 4 && (request.status >= 200 && request.status < 300 || request.status === 304 || navigator.userAgent.indexOf("Safari") >= 0 && typeof request.status === "undefined")) {
          var parser = new DOMParser();
          var html = parser.parseFromString(request.responseText, "text/html");
          callback(html);
        }
      };
      request.send();
    };
  
    gallery.resize = function(element) {
      var windowHeight = window.innerHeight * 0.9,
          windowWidth = window.innerWidth * 0.9,
          elementHeight = element[0].firstChild.naturalHeight,
          elementWidth = element[0].firstChild.naturalWidth,
          windowScale = windowHeight / windowWidth,
          elementScale = elementHeight / elementWidth;
      
      if (windowHeight < elementHeight && (elementScale >= windowScale)) {
        element[0].style.height = windowHeight + "px";
        element[0].style.width = (windowHeight / elementHeight) * elementWidth + "px";
      } else if (windowWidth < elementWidth && (elementScale < windowScale)) {
        element[0].style.width = windowWidth + "px";
        element[0].style.height = (windowWidth / elementWidth) * elementHeight + "px";
      } else {
        element[0].style.height = elementHeight + "px";
        element[0].style.width = elementWidth + "px";
      }
    };
            
    gallery.removeActive = function(direction) {
      gallery.active.removeClass(settings.activeNameClass + " " + settings.prevNameClass + " " + settings.nextNameClass);
      if(direction) {  
        gallery.active.addClass(direction);
      }
    };
    
    gallery.resetActive = function(element) {
      element[0].style.width = "auto";
      element[0].style.height = "auto";
      element[0].style.backgroundImage = "none";
      if (element[0].querySelectorAll("." + settings.comment).length > 0) {
        element[0].removeChild(element[0].querySelectorAll("." + settings.comment)[0]);
      }
    };
            
    gallery.setActive = function(direction) {
      gallery.active.removeClass(settings.prevNameClass + " " + settings.nextNameClass).addClass(settings.activeNameClass);
      if(direction) {  
        gallery.active.addClass(direction);
      }
    };
            
    gallery.nav = function(direction) {
      gallery.load((gallery.firstElement.hasClass(settings.activeNameClass)) ?
        gallery.secondElement :
        gallery.firstElement,
        self[(direction > 0) ? gallery.navNext(direction) : gallery.navPrev(direction)],
          (direction > 0) ? settings.nextNameClass : settings.prevNameClass);
        };
            
      gallery.navPrev = function(direction) {
        return ((gallery.elementOf(gallery.element, self) + direction) < 0) ? len - 1 : gallery.elementOf(gallery.element, self) + direction;
      };
            
      gallery.navNext = function(direction) {
        return ((gallery.elementOf(gallery.element, self) + direction) > len - 1) ? 0 : gallery.elementOf(gallery.element, self) + direction;
      };
            
      gallery.load = function(element, anchor, direction) {
        if (element[0].firstChild.localName === "img") {
          element[0].firstChild.setAttribute("src", anchor.href);
          gallery.removeActive(direction);
          gallery.resetActive(element);
          gallery.active[0].firstChild.onload = undefined;
          gallery.active = element;
          gallery.element = anchor;
          gallery.setActive(direction);
          gallery.loader.removeClass(settings.inactiveNameClass + " " + settings.errorNameClass).addClass(settings.activeNameClass);
          element[0].firstChild.onload = function() {
            gallery.change(element, anchor);
            element.removeClass(settings.errorNameClass);
            element.addClass(settings.activeNameClass);
          };
          element[0].firstChild.onerror = function() {
            gallery.loader.addClass(settings.errorNameClass);
            element.addClass(settings.errorNameClass);
          };
        }
      };
            
      gallery.build = function() {
        gallery.mask = document.getElementById(settings.mask);
        gallery.mask = new Comp((gallery.mask !== null) ? gallery.mask : gallery.create("div", document.body));
        gallery.mask.attr("id", settings.mask).addClass(settings.mask);
              
        if(gallery.mask.length > 0) {
          gallery.maskBefore = new Comp(gallery.create("div", gallery.mask[0]));
          gallery.maskBefore.attr("id", settings.maskBefore).addClass(settings.maskBefore);
        }
  
        if(gallery.maskBefore.length > 0) {
          gallery.maskBeforeButton = new Comp(gallery.create("div", gallery.maskBefore[0]));
          gallery.maskBeforeButton.attr("id", settings.maskBeforeButton).addClass(settings.maskBeforeButton);
        }
  
        if(gallery.mask.length > 0) {
          gallery.content = new Comp(gallery.create("div", gallery.mask[0]));
          gallery.content.attr("id", settings.content).addClass(settings.content);
        }
              
        if(gallery.mask.length > 0 && gallery.content.length > 0 && settings.nav) {
          gallery.prev = new Comp(gallery.create("div", gallery.content[0]));
          gallery.prev.attr("id", settings.prev).addClass(settings.prev).inner(settings.prevText);
  
          gallery.next = new Comp(gallery.create("div", gallery.content[0]));
          gallery.next.attr("id", settings.next).addClass(settings.next).inner(settings.nextText);
        }
              
        if(gallery.mask.length > 0 && gallery.content.length > 0) {
          gallery.firstElement = new Comp(gallery.create("div", gallery.content[0]));
          gallery.firstElement.attr("id", settings.firstElement).addClass(settings.firstElement);
          
          gallery.firstElementImg = new Comp(gallery.create("img", gallery.firstElement[0]));
                
          gallery.active = gallery.firstElement;
        }
  
        if(gallery.mask.length > 0 && gallery.content.length > 0 && settings.animation === "slide") {
          gallery.secondElement = new Comp(gallery.create("div", gallery.content[0]));
          gallery.secondElement.attr("id", settings.secondElement).addClass(settings.secondElement);
                
          gallery.secondElementImg = new Comp(gallery.create("img", gallery.secondElement[0]));
        }
              
        if(gallery.mask.length > 0 && gallery.content.length > 0) {
          gallery.loader = new Comp(gallery.create("div", gallery.content[0]));
          gallery.loader.attr("id", settings.loader).addClass(settings.loader);
        }
      };
            
      gallery.events = function() {
        gallery.maskBefore.on("click", function() {
          gallery.close();
        });
        
        gallery.maskBeforeButton.on("click", function() {
          gallery.close();
        });
              
        gallery.next.on("click", function() {
          gallery.nav(1);
        });
              
        gallery.prev.on("click", function() {
          gallery.nav(-1);
        });
        
        if(gallery.loadEvents) {
          gallery.loadEvents = false;
          addEventListener("keypress", function(event) {
            if(gallery.activeFlag) {
              switch (true) {
                case event.key === "ArrowRight" || event.key === "d" || event.key === "D":
                  gallery.nav(1);
                break;
                case event.key === "ArrowLeft" || event.key === "a" || event.key === "A":
                  gallery.nav(-1);
                break;
                case event.key === "Escape" || event.key === "z" || event.key === "Z":
                  gallery.close();
                break;
              }
            }
          });
        }
      };
      
      gallery.show = function() {
        gallery.mask.addClass(settings.activeNameClass);
        if(settings.hiddenScroll) {
          body[0].style.marginRight = gallery.getScrollBar() + "px";
          html.addClass(settings.hiddenScrollClass);
        }
      };
      
      gallery.close = function() {
        gallery.activeFlag = false;
        gallery.mask.removeClass(settings.activeNameClass);
        if(settings.hiddenScroll) {
          body[0].style.marginRight = "0";
          html.removeClass(settings.hiddenScrollClass);
        }
        gallery.mask[0].innerHTML = "";
      };
            
      gallery.run = function(element) {
        gallery.activeFlag = true;
        gallery.build();
        gallery.events();
        gallery.show();
        gallery.load(gallery.active, element);
      };
      
      addEventListener("resize", function() {
        if (gallery.active) {
          requestAnimationFrame(function() {
            gallery.resize(gallery.active);
          });
        }
      });
            
      new Comp((settings.parent) ? settings.parent : self).on("click", function(event) {
        event.preventDefault();
        if(settings.album) {
          gallery.request(event.currentTarget.href, function(html){
            self = html.querySelectorAll(settings.albumClass);
            len = self.length;
            gallery.run(self[0]);
          });
        } else {
          var element = (event.target.localName === "img") ? event.target.parentElement : event.target;
          if (element.localName === "a") {
            gallery.run(element);
          }
        }
      });    
    };
  })(Comp);