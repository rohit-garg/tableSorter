/* Description: Light Weighed table sorter plugin
 * Author: Rohit Garg   
 * Version: 1.0.1 */

(function ($, window) {

    var mySorter = function (ele, opt) {

        var $this = this;
        var element = $(ele);

        var settings = $.extend({
            eleBody: element.children('tbody'),
            $eleHeads: element.children('thead').find('th'),
            sortCol: 0
        }, opt);

        var eleBody = settings.eleBody;
        var $eleHeads = settings.$eleHeads;

        var currentSortedCol = 0;

        var css = {
            container: 'sorterMain',
            arrowCls: 'sorterArrow',
            defaultHead: 'defaultSortedCol',
            sortOrder: ['ascSorterdCol', 'descSortedCol']
        };

        var init = function () {
            addArrows();
            attachHandlers();
            getDefaultColSorted();
        };

        this.sortCol = function (colNum, desc) {
            var eleRows = eleBody.children('tr');
            if (typeof colNum == "undefined") {
                colNum = currentSortedCol;
            }

            eleRows.sort(function (a, b) {
                var fstEle = $(a).children('td').eq(colNum);
                var secEle = $(b).children('td').eq(colNum);

                var fstTxt = fstEle.text();
                var secTxt = secEle.text();

                if (fstEle.data('sortkey') != null && secEle.data('sortkey') != null) {
                    fstTxt = fstEle.data('sortkey');
                    secTxt = secEle.data('sortkey');
                }

                if (isNaN(fstTxt) && isNaN(secTxt)) {
                    fstTxt = fstTxt.toLowerCase();
                    secTxt = secTxt.toLowerCase();
                }
                else {
                    fstTxt = parseFloat(fstTxt);
                    secTxt = parseFloat(secTxt);
                }

                if (desc) {
                    if (fstTxt < secTxt) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    if (fstTxt > secTxt) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
            });

            currentSortedCol = colNum;
            eleBody.append(eleRows);
        };

        this.refresh = function () {
            $this.sortCol();
        };

        var addArrows = function () {
            var html = '<span class="' + css.arrowCls + '"> </span>';
            $eleHeads.append(html);
        };

        var getDefaultColSorted = function () {
            var index = settings.sortCol;
            $eleHeads.each(function (ind, curr) {
                var key = $(this).data('sortdefault');
                if (key == true) {
                    index = ind;
                }
            });
            $eleHeads.eq(index).trigger('click');
        };

        var attachHandlers = function () {

            $eleHeads.each(function (ind, curr) {
                $(this).addClass(css.defaultHead).data('sortOrder', 1);
            });

            $eleHeads.on('click', function (e) {
                var num = $(this).index();
                $eleHeads.removeClass(css.sortOrder.join(' '));
                var toggle = $(this).data('sortOrder') ? 0 : 1;
                $this.sortCol(num, toggle);
                $(this).addClass(css.sortOrder[toggle]).data('sortOrder', toggle);
            });

        };

        init();
    };

    $.fn.extend({
        mySorter: function (options) {
            return this.each(function ()
            {
                if (!$(this).data('mySorter')) {
                    var obj = new mySorter(this, options);
                    $(this).data('mySorter', obj);
                }
            });
        }
    });

})(jQuery, window);



/*
 * Parameter examples - 
 * 
 *  From html data
 *      <th data-sortdefault="true">Amount</th>     selecting default col for sorting
 *      <td data-sortkey="1999">Rs. 1999</td>       sorting to be done on provided data in key
 *      
 *  From javascript
 *      $('#abc').mySorter({
 *          $eleHeads: $('#external span'),     for providing heads out of current table
 *          sortCol: 0      selecting default col for sorting, priority will be given to data-sortdefault key
 *       });
 *       
 *       
 *       $('.sorterMain').each(function () {
 *           $heads = $(this).find('.sorterHeads th');
 *           $(this).find('.sorterBody').mySorter({
 *              $eleHeads: $heads
 *          });
 *      });
 */



