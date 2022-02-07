(function () {
    var Comp = function (selector) {
      return new Library(selector);
    };
      
    var Library = function (selector) {
      if (typeof selector === "object" && typeof selector.length === "undefined") {
        var selector = selector;
            this.length = 1;
            this.version = '0.1';
            this[0] = selector;
        return this;          
      } else {
        if (typeof selector === "object") {
          var selector = selector;
        } else {
          var selector = document.querySelectorAll(selector);
        }
        
        var i = 0;  
        this.length = selector.length;
        this.version = '0.1';
        
        for (; i < this.length; i++) {
          this[i] = selector[i];
        }
        return this;
      } 
    };
      
    Comp.fn = Library.prototype = {
      addClass: function (className) {
        var len = this.length, 
            className = className.split(" "),
            classArrayLength = className.length;
  
        while (len--) {
          for (var i = 0; i < classArrayLength; i++) {
            if (this[len].classList) {
              this[len].classList.add(className[i]);
            } else {
              this[len].className += ' ' + className[i];
            }
          }
        }
  
        return this;
      },
      addPositionData: function() {
        var len = this.length;
  
        while(len--) {
          this[len].setAttribute("data-top", this[len].getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0));
          this[len].setAttribute("data-bottom", this[len].getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0) + parseInt(getComputedStyle(this[len]).marginTop) + parseInt(getComputedStyle(this[len]).marginBottom) + this[len].offsetHeight);
        }
  
        return this;            
      },
      attr: function(attribute, set) {
        var len = this.length;
  
        if (set) {
          while(len--) {
            this[len].setAttribute(attribute, set);
          }
        } else {
          this[0].getAttribute(attribute);
        }
  
        return this;
      },
      foreach: function (callback) {
        var len = this.length;
  
        while(len--) {
          callback.apply(this[len]);
        }
  
        return this;
      },
      changeClass: function (firstClassName, secondClassName) { //card
        var len = this.length;
  
        while(len--) {
          if (this[len].classList.contains(firstClassName)) {
            this[len].classList.remove(firstClassName); 
            this[len].classList.add(secondClassName);
          } else {
            if (this[len].classList.contains(secondClassName)) {
              this[len].classList.remove(secondClassName); 
            }
            if (this[len].classList) {
              this[len].classList.add(firstClassName);
            } else {
              this[len].className += ' ' + firstClassName;
            }                    
          } 
        }
  
        return this;
      },
      isChecked: function (change) {
        if (this.length === 0) {
          return this;
        } else {
          if(typeof change === "boolean") {
            this[0].checked = change;
          } else {
            return this[0].checked;
          }   
        }
      },
      get: function(option) {     
        switch(option) {
          case "height":
            return this[0].getBoundingClientRect().height;
          break;
          case "marginTop":
            return this[0].getBoundingClientRect().height;
          break;
        }   
      },
      on: function(type, callback){
        var len = this.length;
  
        while(len--) {
          this[len].addEventListener(type, callback);
        }
  
        return this;
      },
      hasClass: function(className) {
        if (this[0].classList) {
          return this[0].classList.contains(className);
        }
  
        return false;
      },
      index: function() {
        var len = this[0].parentElement.children.length;
        for (i = 0; i < len; i++) {
          if (this[0].parentElement.children[i] === this[0]) {
            return i;
          }    
        }
  
        return -1;
      },
      inner: function(content) {
        var len = this.length;
  
        while(len--) {
          this[len].innerHTML = content;
        }
  
        return this;            
      },
      removeClass: function (className) {
        var len = this.length,
            className = className.split(" "),
            classArrayLength = className.length; 
  
        while (len--) {
          for (var i = 0; i < classArrayLength; i++) {
            if (this[len].classList) {
              this[len].classList.remove(className[i]);
            } else {
              this[len].className = this[len].className.replace(new RegExp('(^|\\b)' + className[i].split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
          }
        }
  
        return this;
      },
      style: function(option, value) {     
        var len = this.length;
  
        while(len--) {
          switch(option) {
            case "marginTop":
              this[len].style.marginTop = value;
            break;
            case "marginBotom":
              this[len].style.marginBottom = value;
            break;
            case "minHeight":
              this[len].style.minHeight = value;
            break;
            case "transitionDelay":
              this[len].style.transitionDelay = value;
            break;
            case "width":
              this[len].style.width = value;
            break;    
          }   
        }
  
        return this;  
      }
    };
      
  if (!window.Comp) {
    window.Comp = Comp;
  }
  })(); 