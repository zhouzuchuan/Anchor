/*
 * @File Name:     anchor.js
 * @Create By:     zhouzuchuan
 * @Create Time:   2016-03-15 09:08:17
 * @Modified By:   zhouzuchuan
 * @Modified Time: 2016-05-03 10:35:57
 */

;(function ($, window, document) {

    'use strict';

    function Anchor (options) {
        if (this === window) return new Anchor(options);
        this.options = {
            scrollDelay: 300,
            closeScroll: false
        };
        for (var props in options) this.options[props] = options[props];
        this.baseLine = 0;
        this.collection = [];
        this._init();
    }

    Anchor.prototype = {
      version: '1.0.0',
      // 初始化
      _init: function () {
          var self = this,
              ds = self._dealSelector(),
              arr = [];

          self._dealBaseLine();
          // 储存区块数据
          $.each($('[' + ds.main + ']'), function (index, element) {
              var item = self.collection,
                  et = $(element).offset().top,
                  eh = $(element).outerHeight();

              item[index] = {};
              item[index].key = $(element).attr(ds.main);
              item[index].top = et;
              item[index].height = eh;
              // 储存所需要的对比位置数据
              arr.push(et, et + eh, et - self.baseLine);
          });
          // 储存区域的活动范围
          self.mixin = [];
          self.mixin.push(Math.min.apply(null,arr), Math.max.apply(null,arr));

          this.clickAndScrollSwitch = true;
          if (!isUndefined($(window).on)) {
              $(document).on('click', '[' + ds.btn + ']', self._onClickEvent());
              $(window).on({'scroll': self._onScrollEvent()});
          } else {
              $(document).delegate('[' + ds.btn + ']', 'click', self._onClickEvent());
              $(window).bind({'scroll': self._onScrollEvent()});
          }

          self._scrollHandler();
      },
      _dealAnimation: function () {
          var opt = this.options,
              ant = opt.scrollAnimation,
              animationOptions = {
                  enabled: true,
                  speed: 500,
                  easing: 'swing',
                  callback: $.noop
              };
          switch (getType(ant)) {
              case 'array':
                  if (ant.length < 3) break;
                  if (!isUndefined(ant[0])) animationOptions.speed = ant[0];
                  if (!isUndefined(ant[1])) animationOptions.easing = ant[1];
                  if (!isUndefined(ant[2])) animationOptions.callback = ant[2];
                  break;
              case 'boolean':
                  animationOptions.enabled = false;
                  break;
          }
          return animationOptions;
      },
      // 处理基准线位置
      _dealBaseLine: function () {
          var opt = this.options,
              win = $(window);

          if (getType(opt.baseLine) === 'number') {
              this.baseLine = opt.baseLine;
          } else {
              switch (opt.baseLine) {
                  case 'middle':
                      this.baseLine = win.height() / 2;
                      break;
                  case 'top':
                      this.baseLine = 0;
                      break;
                  case 'bottom':
                      this.baseLine = win.height();
                      break;
                  default:
                      this.baseLine = 0;
                      break;
              }
          }
      },
      // 处理选择器
      _dealSelector: function () {
          var opt = this.options,
              das = this._dealArray(opt.selector);

          das.btn = (das.btn === null) ? 'zzc-anchor-btn' : das.btn;
          das.main = (das.main === null) ? 'zzc-anchor-main' : das.main;
          // 如果指定的两个选择器相同 则添加后缀区分
          if (das.btn === das.main) {
              das.btn += '-btn';
              das.main += '-main';
          }
          return {
              btn: das.btn,
              main: das.main
          };
      },
      // 处理数组
      _dealArray: function () {
          var btn,
              main,
              arg = arguments[0];
          if (arguments.length === 0 || arguments.length > 1) return;
          switch (getType(arg)) {
              case 'array':
                  for (var i = 0, len = arg.length; i < len ; i += 1) {
                      var tr = $.trim(arg[i]);
                      arg[i] = tr === '' ? null : tr;
                  }
                  if (arg.length >= 2) {
                      btn = arg[0];
                      main = arg[1];
                  } else {
                      btn = main = arg[0];
                  }
                  break;
              case 'string':
                  btn = main = $.trim(arg);
                  break;
              default:
                  btn = main = null;
                  break;
            }
          return {
              btn: removePoint(replaceBrackets(btn)),
              main: removePoint(replaceBrackets(main))
          };
      },
      // 点击函数
      _clickHandler: function (e) {
          var self = this,
              opt = self.options,
              ds = self._dealSelector(),
              dac = self._dealArray(opt.currentClass),
              da = self._dealAnimation(),
              target = $(e.currentTarget),
              targetMain = $('[' + ds.main + '=' + target.attr(ds.btn) + ']'),
              key = target.attr(ds.btn),
              Elem = document.documentElement || document.body,
              html =  /webkit/.test(window.navigator.userAgent.toLowerCase()) ? 'body' : 'html',
              timer;

          if (target.hasClass(dac.btn) || targetMain.hasClass(dac.main)) return;
          window.clearTimeout(self._timer);
          this.clickAndScrollSwitch = false;
          for (var i = 0, len = self.collection.length; i < len; i += 1) {
              var coll = self.collection;
              if (coll[i].key !== key) continue;
              run (coll);
              self._removeClass();
              self._addClass(i);
          }
          function run () {
              var coll = arguments[0];
              if (da.enabled) {
                  // $(window).off('scroll.zzc_anchor');
                  $(html).stop().animate({'scrollTop': coll[i].top}, da.speed, da.easing, function () {
                      da.callback.call(self);
                      // $(window).on({'scroll.zzc_anchor': self._onScrollEvent()});
                      self._timer = window.setTimeout(function () {
                          self.clickAndScrollSwitch = true;
                      }, opt.scrollDelay);
                  });
              } else {
                  Elem.scrollTop = coll[i].top;
                  self._timer = window.setTimeout(function () {
                      self.clickAndScrollSwitch = true;
                  }, opt.scrollDelay);
              }
          }
      },
      // 滚动函数
      _scrollHandler: function () {
        var self = this,
            coll = self.collection,
            st = $(window).scrollTop(),
            maxH = Math.max.apply(null, self.mixin),
            minH = Math.min.apply(null, self.mixin),
            chuan = -1;

        if (this.options.closeScroll) return;
        if (!this.clickAndScrollSwitch) return;
        for (var i = 0 , len = coll.length; i < len; i += 1 ) {
            var ct = coll[i].top;
            // 获取达到高度的最大值
            if (st + self.baseLine >= ct) {
                chuan = Math.max(chuan , ct);
            }
        }

        // 超出数据中最大或最小高度区域 清除选中
        if (st > maxH || st < minH) {
            chuan = -1;
            self._removeClass('noDid');
            if (getType(self.options.outArea) === 'function') {
                self.options.outArea.apply(self,arguments);
                this.currentSelect = 'undefined';
            }
        }

        // 监听的高度没有改变 跳出本次循环
        if (chuan === self.currentMaxRangValue) return;
        self.currentMaxRangValue = chuan;
        for (var j = 0 , all = coll.length; j < all; j += 1 ) {
            var ct2 = coll[j].top;
            if (ct2 !== self.currentMaxRangValue) continue;
            self._removeClass();
            self._addClass(j);
        }
      },
      _removeClass: function () {
          var ds = this._dealSelector(),
              opt = this.options,
              dac = this._dealArray(opt.currentClass),
              value,
              $leaveBtn,
              $leaveMain;

          $('[' + ds.btn + ']').removeClass(dac.btn);
          $('[' + ds.main + ']').removeClass(dac.main);
          // 如果移出了整体活动范围不执行
          if (arguments[0] === 'noDid') return;
          if (getType(opt.currentDid) === 'function') {
              if (!isUndefined(this.currentSelect)) {
                  value = this.collection[this.currentSelect].key;
                  $leaveBtn = $('[' + ds.btn + '=' + value + ']');
                  $leaveMain = $('[' + ds.main + '=' + value + ']');
              }
              opt.currentDid.call(this, $leaveBtn, $leaveMain);
          }
      },
      _addClass: function () {
          var ds = this._dealSelector(),
              opt = this.options,
              dac = this._dealArray(opt.currentClass),
              value = this.collection[arguments[0]].key,
              $currentBtn = $('[' + ds.btn + '=' + value + ']'),
              $currentMain = $('[' + ds.main + '=' + value + ']');

          this.currentSelect = arguments[0];
          if (getType(opt.currentWill) === 'function') {
              opt.currentWill.call(this, $currentBtn, $currentMain);
          }
          for (var i in dac) {
              if (dac[i] === '') continue;
              $('[' + ds[i] + '=' + value + ']').addClass(dac[i]);
          }

      },
      // 绑定点击事件
      _onClickEvent: function () {
          var self = this;
          return function (e) {
              e.stopPropagation();
              self._clickHandler.apply(self,arguments);
          };
      },
      // 绑定滚动事件
      _onScrollEvent: function () {
          var self = this;
          var switchScrollDelay = true;
          // 开关 处理点击按钮 scrollTop 触发两次问题
          return function (e) {
              if (!switchScrollDelay) return;
              switchScrollDelay = false;
              window.setTimeout(function () {
                  self._scrollHandler();
                  switchScrollDelay = true;
              }, self.options.scrollDelay);
          };
      }

    };

    // 替换'[]'
    function replaceBrackets (str) {
        return (/^\[[\S]+\]$/ig).test(str) ? str.slice(1,-1) : str;
    }
    function removePoint (str) {
        return (/^\./).test(str) ? str.slice(1) : str;
    }
    function getType (obj) {
        return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
    }
    function isUndefined (a) {
        return (a === null || typeof a == 'undefined' || a === '' || a === 'undefined');
    }


    window.Anchor = Anchor;


} (jQuery, window, document));


