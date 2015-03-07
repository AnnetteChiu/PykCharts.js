PykCharts.multiD.river = function (options){
    var that = this;
    that.interval = "";
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function (pykquery_data){
        that = new PykCharts.validation.processInputs(that, options, 'multiDimensionalCharts');
        var multiDimensionalCharts = theme.multiDimensionalCharts,
            stylesheet = theme.stylesheet,
            optional = options.optional;

        that.data_mode_enable = options.data_mode_enable ? options.data_mode_enable.toLowerCase() : multiDimensionalCharts.data_mode_enable;
        if(PykCharts.boolean(that.data_mode_enable) && that.mode === "default") {
            that.chart_mode = options.data_mode_default ? options.data_mode_default.toLowerCase() : multiDimensionalCharts.data_mode_default;
            that.data_mode_legends_color = options.data_mode_legends_color ? options.data_mode_legends_color : multiDimensionalCharts.data_mode_legends_color;
        } else {
            that.data_mode_enable = "no";
            that.chart_mode = "absolute";
        }
        that.connecting_lines_color = options.connecting_lines_color ? options.connecting_lines_color : multiDimensionalCharts.connecting_lines_color;
        that.connecting_lines_style = options.connecting_lines_style ? options.connecting_lines_style : multiDimensionalCharts.connecting_lines_style;
        switch(that.connecting_lines_style) {
            case "dotted" : that.connecting_lines_style = "1,3";
                            break;
            case "dashed" : that.connecting_lines_style = "5,5";
                           break;
            default : that.connecting_lines_style = "0";
                      break;
        }
        that.legends_mode = options.legends_mode ? options.legends_mode.toLowerCase() : multiDimensionalCharts.legends_mode;
        that.expand_group = options.expand_group ? options.expand_group : multiDimensionalCharts.expand_group;
        that.text_between_steps_color = options.text_between_steps_color ? options.text_between_steps_color : multiDimensionalCharts.text_between_steps_color;
        that.text_between_steps_weight = options.text_between_steps_weight ? options.text_between_steps_weight.toLowerCase() : multiDimensionalCharts.text_between_steps_weight;
        that.text_between_steps_family = options.text_between_steps_family ? options.text_between_steps_family.toLowerCase() : multiDimensionalCharts.text_between_steps_family;
        that.text_between_steps_size = "text_between_steps_size" in options ? options.text_between_steps_size : multiDimensionalCharts.text_between_steps_size;
        that.k.validator()
            .validatingDataType(that.text_between_steps_size,"text_between_steps_size",multiDimensionalCharts.text_between_steps_size,"text_between_steps_size")
            .validatingFontWeight(that.text_between_steps_weight,"text_between_steps_weight",multiDimensionalCharts.text_between_steps_weight,"text_between_steps_weight")
            .validatingColor(that.text_between_steps_color,"text_between_steps_color",multiDimensionalCharts.text_between_steps_color,"text_between_steps_color")
            .validatingColor(that.connecting_lines_color,"connecting_lines_color",multiDimensionalCharts.connecting_lines_color,"connecting_lines_color")
            .validatingColor(that.data_mode_legends_color,"data_mode_legends_color",multiDimensionalCharts.data_mode_legends_color,"data_mode_legends_color")
            .validatingDataMode(that.chart_mode,"data_mode_default",multiDimensionalCharts.data_mode_default,"chart_mode")
            .validatingLegendsMode(that.legends_mode,"legends_mode",multiDimensionalCharts.legends_mode,"legends_mode");

        if(that.stop) {
            return;
        }
        that.k.storeInitialDivHeight();

        if(that.mode === "default") {
            that.k.loading();
        }

        that.w = that.chart_width - that.chart_margin_left - that.chart_margin_right;
        that.h = that.chart_height - that.chart_margin_top - that.chart_margin_bottom;
        that.multiD = new PykCharts.multiD.configuration(that);
        that.filterList = [];
        that.fullList = [];
        that.extended = that.chart_mode === "absolute" ? false : true;


        that.executeData = function (data) {
            var validate = that.k.validator().validatingJSON(data),
                id = that.selector.substring(1,that.selector.length);
            if(that.stop || validate === false) {
                that.k.remove_loading_bar(id);
                return;
            }

            that.data = data;
            that.data.forEach(function (d) {
                d.group = d.stack;
            });
            // console.log(that.data)
            that.axis_y_data_format = "number";
            that.axis_x_data_format = "number"
            that.compare_data = that.data;
            that.data_length = that.data.length;
            that.k.remove_loading_bar(id);
            that.map_group_data = that.multiD.mapGroup(that.data,"river");
            that.dataTransformation();
            that.render();
        };
        if (PykCharts['boolean'](that.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeData");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeData");
        }   

    };
    this.render = function () {
        var id = that.selector.substring(1,that.selector.length),
            container_id = id + "_svg";
        that.multid = new PykCharts.multiD.configuration(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.border = new PykCharts.Configuration.border(that);
        if(that.mode === "default") {
            that.k.title()
                    .backgroundColor(that)
                    .export(that,"#"+container_id,"river")
                    .liveData(that)
                    .emptyDiv(that.selector)
                    .subtitle()
                    .tooltip();
            that.optional_feature()
                .svgContainer(container_id,1)
                .legendsContainer()
                .legends()
                .dataModeContainer()
                .dataMode()
                .createGroups(1)
                .preProcessing()
                .ticks()
                .yAxisLabel()
                .grids()
                .durationLabel()
                .createChart()
                .connectingLines()
                .highlight();

            that.k.createFooter()
                    .lastUpdatedAt()
                    .credits()
                    .dataSource();
        }
        else if(that.mode === "infographics") {
              that.k.liveData(that)
                        .backgroundColor(that)
                        .export(that,"#"+container_id,"river")
                        .emptyDiv(that.selector)
                        .makeMainDiv(that.selector,1);

              that.optional_feature()
                        .svgContainer(container_id,1)
                        .legendsContainer()
                        .dataModeContainer()
                        .dataMode()
                        .createGroups(1)
                        .preProcessing()
                        .ticks()
                        .yAxisLabel()
                        .grids()
                        .durationLabel()
                        .createChart()
                        .connectingLines();

        }
        that.k.exportSVG(that,"#"+container_id,"river")
        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);
        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });

    };
    that.dataTransformation = function () {
        that.group_arr = [], that.new_data = [],that.uniq_alias_arr = [],that.uniq_duration_arr = [];
        that.data_length = that.data.length;
        for(var j = 0;j < that.data_length;j++) {
            that.group_arr[j] = that.data[j].y;
        }
        that.uniq_group_arr = that.k.__proto__._unique(that.group_arr);
        var len = that.uniq_group_arr.length;
        for (var k = 0;k < len;k++) {
            for (var l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.uniq_alias_arr[k] = that.data[l].alias;
                    that.uniq_duration_arr[k] = that.data[l].text_between_steps || "";
                    break;
                }
            }
        }

        for (var k = 0;k < len;k++) {
            that.new_data[k] = {
                    display_name: that.uniq_group_arr[k],
                    breakup: [],
                    technical_name: that.uniq_alias_arr[k],
                    duration: that.uniq_duration_arr[k]
            };
            for (var l = 0;l < that.data_length;l++) {
                if (that.uniq_group_arr[k] === that.data[l].y) {
                    that.new_data[k].breakup.push({
                        count: +that.data[l].x,
                        name: that.data[l].stack,
                        tooltip: that.data[l].tooltip,
                        color: that.data[l].color
                    });
                }
            }
        }
        that.opacity_array = [];
        that.new_data_length = that.new_data.length;
        for(var i = 0; i<that.new_data_length;i++) {
            that.opacity_array.push(((that.new_data_length-i)/that.new_data_length)) 
        }
    };
    that.refresh = function(pykquery_data) {
        that.executeRefresh = function (data) {
            that.data = data;
            that.refresh_data = data;
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.data.forEach(function (d) {
                d.group = d.stack;
            })
            that.map_group_data = that.multiD.mapGroup(that.data);
            that.dataTransformation();
            that.draw();
            that.optional_feature().grids()
                .yAxisLabel()
                .durationLabel();
        };
        if (PykCharts['boolean'](that.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    }
    this.draw = function(){
        that.optional_feature().legends().dataMode().preProcessing().createChart().grids();
        that.optional_feature().connectingLines().ticks().highlight();
    };
    that.optional_feature = function (){
        var id = that.selector.substring(1,that.selector.length);
        var optional = {
            svgContainer: function (container_id,i){
                document.getElementById(id).className += " PykCharts-twoD PykCharts-multi-series2D PykCharts-line-chart";

                that.svgContainer = d3.select(that.selector).append("svg:svg")
                    .attr({
                        "id": container_id,
                        "width": that.chart_width,
                        "height": that.chart_height,
                        "class": "svgcontainer PykCharts-river",
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height
                    });
                return this;
            },
            createGroups : function (i) {
                that.group = that.svgContainer.append("g")
                    .attr({
                        "id": "river-group",
                        "transform": "translate("+ that.chart_margin_left +","+ (that.legendsGroup_height)+")"
                    });
                that.ygroup = that.svgContainer.append("g")
                    .attr("transform","translate("+ 0 +","+ (that.legendsGroup_height)+")");
                that.grid_group = that.svgContainer.append("g")
                    .attr("transform","translate("+ 0 +","+ (that.legendsGroup_height)+")");
                that.ticks_group = that.svgContainer.append("g")
                    .attr("transform","translate("+ (0) +","+ (that.legendsGroup_height)+")")
                return this;
            },
            dataModeContainer : function () {
                that.chart_mode_group = that.svgContainer.append("g")
                    .attr("translate","transform(0,0)");
                return this;
            },
            legendsContainer : function (i) {
                if(PykCharts.boolean(that.legends_enable) && that.mode === "default") {
                    that.legendsGroup = that.svgContainer.append("g")
                        .style("visibility","visible")
                        .attr({
                            'id': "river-legends",
                            "class": "legends"
                        });
                        // .attr("transform","translate(0,10)");
                } else {
                    that.legendsGroup_height = 0;
                    that.legendsGroup_width = 0;
                    that.new_data[0].breakup.forEach(function(d) {
                        that.filterList.push(d.name);
                        that.fullList.push(d.name);
                    })
                }
                var opacity_array =  that.new_data[0].breakup.map(function(d) {
                    return d.name
                })
                that.color_opacity = d3.scale.ordinal()
                        .domain(opacity_array)
                        .rangeBands([1,0.1]);
                return this;
            },
            preProcessing: function () {
                that.new_data1 =  JSON.parse( JSON.stringify(that.new_data) );
                that.highlightdata = [],highlight_index = -1;
                that.new_data1 = that.filter(that.new_data1);
                that.new_data1 = that.parseData(that.new_data1);
                that.maxTotalVal = that.maxTotal(that.new_data1);
                that.highlight_enable = false;
                that.yScale = d3.scale.linear().domain([0, that.chart_height]).range([0, that.chart_height-that.legendsGroup_height]);
                that.barHeight = (that.chart_height) / (that.new_data1.length * 2);
                that.barMargin = that.barHeight * 2;

                return this;
            },
            createChart : function () {
                that.chart_margin_left = that.max_label + 10;
                that.chart_margin_right = that.max_duration > that.max_tick ? (that.max_duration + 10) : (that.max_tick + 10);
                var height = that.chart_height;
                var width = that.chart_width - that.legendsGroup_width - that.chart_margin_right - that.chart_margin_left;
                that.group.attr("transform","translate("+ that.chart_margin_left +","+ (that.legendsGroup_height)+")");
                if(!that.extended) {
                    that.xScale = d3.scale.linear().domain([0, that.maxTotalVal]).range([0, width]);
                } else {
                    that.xScale = d3.scale.linear().range([0, width]);
                }
                var svg = that.group;
                var groups = svg.selectAll("g.river-bar-holder").data(that.new_data1);

                groups.enter().append("g").attr("class", "river-bar-holder")
                    .attr("transform", function(d, i){
                        var y = that.yScale(i * that.barMargin);
                        var x = that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        if(that.extended) {
                            var x = 0;
                        }

                        return "translate("+x+","+y+")";
                    });

                groups.transition().duration(that.transitions.duration())
                    .attr("transform", function(d, i){
                        var y = that.yScale(i * that.barMargin);
                        var x = that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                        if(that.extended){
                            x = that.yScale(0);
                        }
                        if(d.display_name.toLowerCase() === that.highlight.toLowerCase()) {
                            that.highlightdata.push(d);
                            that.highlight_index = i;
                            that.highlight_enable = true;
                        }
                        return "translate("+x+","+y+")";
                    });

                groups.exit().remove();

                var bar_holder = svg.selectAll("g.river-bar-holder")[0];
                for(var i = 0; i<that.new_data1.length; i++){
                    var group = bar_holder[i];
                    var breakup = that.new_data1[i].breakup;
                    var len = that.new_data[i].breakup.length;
                    var uniq_name = that.new_data[i].display_name;
                    if(that.extended) {
                        that.xScale.domain([0,that.new_data1[i].breakupTotal]);
                    }

                    var rects = d3.select(group).selectAll("rect").data(breakup);

                    rects.enter().append("rect").attr({
                        "width": 0,
                        "class": "river-rect"
                    });

                    rects.transition().duration(that.transitions.duration())
                        .attr({
                            "x": function(d, i){
                                if (i === 0) return 0;
                                var shift = 0;
                                for(var j = 0; j < i; j++){
                                    shift += breakup[j].count;
                                }
                                return that.xScale(shift);
                            },
                            "y": 0,
                            "height": function(d, i){

                                return (that.barHeight * (height - that.legendsGroup_height)) / height;

                            },
                            "width": function(d,i){
                                return that.xScale(d.count);
                            }
                        });

                    rects.attr({
                        "fill": function (d) {
                            return that.fillColor.colorPieMS(d);
                        },
                        "stroke": that.border.color(),
                        "stroke-width": that.border.width(),
                        "stroke-dasharray": that.border.style(),
                        "fill-opacity": function (d,i) {
                            if(that.color_mode === "saturation") {
                                return that.color_opacity(d.name);
                            }
                            return 1;
                        },
                        "data-fill-opacity": function () {
                            return d3.select(this).attr("fill-opacity");
                        },
                        "data-id":function (d,i) {
                            return uniq_name + "-" + d.name;
                        }
                    })
                    .on({
                        "mouseover": function(d, i){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlight(that.selector + " .river-rect", this);
                                }
                            }
                        },
                        "mousemove": function(d){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        },
                        "mouseout": function(d){
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipHide(d);
                                if(PykCharts.boolean(that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightHide(that.selector + " .river-rect")
                                }
                            }
                        },
                        "click": function(d, i){
                            if(PykCharts['boolean'](that.click_enable)){
                                that.addEvents(uniq_name + "-" + d.name, d3.select(this).attr("data-id")); 
                            } 
                            // if(PykCharts.boolean(that.expand_group) && that.mode === "default") {
                            //     that.onlyFilter(d.name);
                            // }
                        }
                    });

                    rects.exit().transition().duration(that.transitions.duration()).attr("width", 0).remove();
                    if(PykCharts.boolean(that.expand_group)) {
                        rects.style("cursor","pointer");
                    }
                }
                return this;
            },
            grids: function () {
                if(PykCharts.boolean(that.chart_grid_y_enable)) {

                    var width = that.chart_width - that.legendsGroup_width;
                    var top_grid = that.grid_group.selectAll("line.grid_top_line")
                        .data(that.new_data1)
                    top_grid.enter()
                        .append("line")
                    top_grid.attr("class", "grid_top_line")
                        .attr({
                            "x1": 0,
                            "x2": width,
                            "y1": function(d, i){
                                return that.yScale(i * that.barMargin);
                            },
                            "y2": function(d, i){
                                return that.yScale(i * that.barMargin);
                            },
                            "stroke": that.chart_grid_color
                        });
                    top_grid.exit().remove();

                    var bottom_grid = that.grid_group.selectAll("line.grid_bottom_line")
                        .data(that.new_data1);
                    bottom_grid.enter()
                        .append("line")
                    bottom_grid.attr({
                        "class": "grid_bottom_line",
                        "x1": 0,
                        "x2": width,
                        "y1": function(d, i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        },
                        "y2": function(d, i){
                            return that.yScale((i * that.barMargin) + that.barHeight);
                        },
                        "stroke": that.chart_grid_color
                    });
                    bottom_grid.exit().remove();
                }
                return this;
            },
            connectingLines: function () {
                if(!that.extended) {
                    var left_angles = that.group.selectAll("line.grid_left_line").data(that.new_data1);

                    left_angles.enter().append("line")
                        .attr({
                            "class": "grid_left_line",
                            "y2": function(d,i){
                                return that.yScale((i * that.barMargin) + that.barHeight);
                            },
                            "x2": function(d,i){
                                return that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                            }
                        });
                    left_angles.style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                    left_angles.transition().duration(that.transitions.duration())
                        .style({
                            "stroke-width": 1,
                            "stroke": that.connecting_lines_color,
                            "stroke-dasharray": that.connecting_lines_style,
                            "shape-rendering": "auto",
                            "stroke-width": function(d,i){
                                if(!that.new_data1[i+1]) return "0";
                            }
                        })
                        .attr({
                            "y1": function(d,i){
                                return that.yScale((i * that.barMargin) + that.barHeight);
                            },
                            "x1": function(d,i){
                                return that.xScale((that.maxTotalVal - d.breakupTotal) / 2);
                            },
                            "y2": function(d,i){
                                return that.yScale(((i+1) * that.barMargin));
                            },
                            "x2": function(d,i){
                                if(!that.new_data1[i+1]) return 0;
                                return that.xScale((that.maxTotalVal - that.new_data1[i+1].breakupTotal) / 2);

                            }
                        });
                    left_angles.exit().remove();
                    var right_angles = that.group.selectAll("line.grid_right_line").data(that.new_data1);

                    right_angles.enter().append("line")
                        .attr({
                            "class": "grid_right_line",
                            "y2": function(d,i){
                                return that.yScale((i * that.barMargin) + that.barHeight);
                            },
                            "x2": function(d,i){
                                return that.xScale(((that.maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal);
                            }
                        });
                    right_angles.style("stroke-width", function(d,i){
                            if(!that.new_data1[i+1]) return "0";
                        })
                    right_angles.transition().duration(that.transitions.duration())
                        .style({
                            "stroke-width": 1,
                            "stroke": that.connecting_lines_color,
                            "stroke-dasharray": that.connecting_lines_style,
                            "shape-rendering": "auto",
                            "stroke-width": function(d,i){
                                if(!that.new_data1[i+1]) return "0";
                            }
                        })
                        .attr({
                            "y1": function(d,i){
                                return that.yScale((i * that.barMargin) + that.barHeight);
                            },
                            "x1": function(d,i){
                                return that.xScale(((that.maxTotalVal - d.breakupTotal) / 2) + d.breakupTotal);
                            },
                            "y2": function(d,i){
                                return that.yScale(((i+1) * that.barMargin));
                            },
                            "x2": function(d,i){
                                if(!that.new_data1[i+1]) return 0;
                                return that.xScale(((that.maxTotalVal - that.new_data1[i+1].breakupTotal) / 2) + that.new_data1[i+1].breakupTotal);
                            }
                        });
                    right_angles.exit().remove();
                } else if(that.extended) {
                    d3.selectAll("line.grid_left_line").remove();
                    d3.selectAll("line.grid_right_line").remove();
                }
                return this;
            },
            ticks: function () {
                if(PykCharts.boolean(that.pointer_size)) {
                    var tick_text_width = [];
                    var width = that.chart_width - that.legendsGroup_width;
                    var display_name = that.ticks_group.selectAll("text.ticks_label").data(that.new_data1);

                    display_name.enter().append("text").attr("class", "ticks_label");

                    display_name.attr("x", width)
                        .attr("y", function(d, i){
                            return that.yScale((i * that.barMargin) + (that.barHeight/2) + 5);
                        })
                        .text(function(d, i){
                            return d.breakupTotal + " " + d.technical_name;
                        })
                        .text(function(d,i){
                            var x = this.getBBox().width;
                            tick_text_width.push(x);
                            return d.breakupTotal + " " + d.technical_name;
                        })
                        .style({
                            "font-weight": that.pointer_weight,
                            "font-size": that.pointer_size + "px",
                            "font-family": that.pointer_family
                        })
                        .attr({
                            "fill": that.pointer_color,
                            "text-anchor": "end"
                        });
                    that.max_tick = d3.max(tick_text_width,function (d) { return d; })
                    display_name.exit().remove();
                }
                return this;
            },
            yAxisLabel : function () {
                var left_labels = that.ygroup.selectAll("text.y_axis_left_label").data(that.new_data1);
                var label_text_width = [];
                left_labels.enter().append("svg:text").attr("class", "y_axis_left_label");

                left_labels
                    .attr({
                        "y": function(d, i){
                            return that.yScale((i * that.barMargin) + (that.barHeight/2) + 5);
                        },
                        "x": 0
                    })
                    .text(function(d,i){
                        return d.display_name;
                    })
                    .text(function (d,i) {
                        var x = this.getBBox().width;
                        label_text_width.push(x);
                        return d.display_name;
                    })
                    .style({
                        "font-size": that.axis_y_pointer_size + "px",
                        "fill": that.axis_y_pointer_color,
                        "font-weight": that.axis_y_pointer_weight,
                        "font-family": that.axis_y_pointer_family
                    });
                that.max_label = d3.max(label_text_width,function (d) { return d; })
                left_labels.exit().remove();
                return this;
            },
            highlight : function () {
                if(that.highlight_enable) {
                    var highlight_rect = that.group.selectAll(".highlight-river-rect")
                        .data(that.highlightdata)
                    highlight_rect.enter()
                        .append("rect")
                        .attr("class","highlight-river-rect");

                    highlight_rect.attr({
                        "y": function(d){
                            return that.yScale((that.highlight_index * that.barMargin)) - 5;
                        },
                        "x": function(d){
                            return that.xScale((that.maxTotalVal - d.breakupTotal) / 2) - 5;
                        },
                        "width": function (d) {
                            return that.xScale(d.breakupTotal) + 10;
                        },
                        "height": (that.barHeight + 5),
                        "fill": "none",
                        "stroke": that.highlight_color,
                        "stroke-width": "1.5px",
                        "stroke-dasharray": "5,5",
                        "stroke-opacity": 1
                    });
                    if(that.extended) {
                        highlight_rect.attr("x",-5)
                            .attr("width", (that.chart_width- that.legendsGroup_width - that.chart_margin_right - that.chart_margin_left + 10))
                    }
                }
                return this;
            },
            durationLabel: function () {
                if(PykCharts.boolean(that.text_between_steps_size)) {
                    var duration_text_width = [];
                    var width = that.chart_width - that.legendsGroup_width;
                    var right_labels = that.ticks_group.selectAll("text.duration_right_label").data(that.new_data1);

                    right_labels.enter().append("svg:text").attr("class", "duration_right_label");

                    right_labels
                        .attr({
                            "y": function(d, i){
                                return that.yScale((i * that.barMargin) + (that.barHeight * 1.5) + 5);
                            },
                            "x": width,
                            "text-anchor": "start",
                            "fill": that.text_between_steps_color
                        })
                        .text(function(d,i){
                            if(that.new_data1[i+1] === undefined){
                                return "";
                            }
                            return d.duration;
                        })
                        .text(function(d,i){
                            var x = this.getBBox().width
                            duration_text_width.push(x);
                            return d.duration;
                        })
                        .style({
                            "font-weight": that.text_between_steps_weight,
                            "font-size": that.text_between_steps_size + "px",
                            "font-family": that.text_between_steps_family
                        })
                        .attr("text-anchor","end");
                    }
                that.max_duration = d3.max(duration_text_width,function (d) { return d; });
                right_labels.exit().remove();
                return this;
            },
            legends : function () {
                if(PykCharts.boolean(that.legends_enable)) {
                    var k = 0;
                    var l = 0;

                    if(that.legends_display === "vertical" ) {
                        that.legendsGroup.attr("height", (that.new_data_length * 30)+20);
                        that.legendsGroup_height = 0;

                        text_parameter1 = "x";
                        text_parameter2 = "y";
                        text_parameter1value = function (d,i) { return 36; };
                        rect_parameter3value = function (d,i) { return 20; };
                        var rect_parameter4value = function (d,i) { return (i * 24 + 12) + 7.5;};
                        var text_parameter2value = function (d,i) { return i * 24 + 23;};

                    } else if(that.legends_display === "horizontal") {
                        that.legendsGroup_height = 50;
                        final_rect_x = 0;
                        final_text_x = 0;
                        legend_text_widths = [];
                        sum_text_widths = 0;
                        temp_text = temp_rect = 0;
                        text_parameter1 = "x";
                        text_parameter2 = "y";

                        var text_parameter1value = function (d,i) {
                            legend_text_widths[i] = this.getBBox().width;
                            legend_start_x = 16;
                            final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                            temp_text = temp_text + legend_text_widths[i] + 30;
                            return final_text_x;
                        };
                        text_parameter2value = 30;
                        var rect_parameter3value = function (d,i) {
                            final_rect_x = (i === 0) ? 0 : temp_rect;
                            temp_rect = temp_rect + legend_text_widths[i] + 30;
                            return final_rect_x;
                        };
                        rect_parameter4value = 18 + 7.5;
                    }
                    var len = that.new_data[0].breakup.length;
                    var legend = that.legendsGroup.selectAll(".river-legends-circles")
                                    .data(that.new_data[0].breakup);

                    that.legends_text = that.legendsGroup.selectAll(".river-legends-text")
                        .data(that.new_data[0].breakup);

                    that.legends_text.enter()
                        .append('text')
                        .text(function (d) {
                            that.filterList.push(d.name);
                            that.fullList.push(d.name);
                        })

                    that.legends_text.attr("class","river-legends-text")
                        .text(function (d) {
                            return d.name;
                        })
                        .on("click", function(d){
                            if(that.legends_mode === "interactive" && that.mode === "default") {
                                that.toggleFilter(d.name);
                            }
                        })
                        .attr({
                            "fill": that.legends_text_color,
                            "font-family": that.legends_text_family,
                            "font-size": that.legends_text_size +"px",
                            "font-weight": that.legends_text_weight
                        })
                        .attr(text_parameter1, text_parameter1value)
                        .attr(text_parameter2, text_parameter2value);

                    legend.enter()
                        .append("circle");

                    legend.attr({
                        "cx": rect_parameter3value,
                        "class": "river-legends-circles",
                        "cy": rect_parameter4value,
                        "r": 7.5,
                        "style": function(d){
                            var fill = (that.filterList.indexOf(d.name) === -1) ? "transparent" : that.fillColor.colorPieMS(d);
                            if(that.filterList.length === 0) fill = that.fillColor.colorPieMS(d);
                            return "fill: "+ fill +"; stroke-width: 3px; stroke:" + that.fillColor.colorPieMS(d);
                        },
                        "opacity": function (d,i) {
                            if(that.color_mode === "saturation") {
                                return that.color_opacity(d.name);
                            }
                            return 1;
                        }
                    })
                    .on("click", function(d){
                        if(that.legends_mode === "interactive" && that.mode === "default") {
                            that.toggleFilter(d.name);
                        }
                    });
                    if(that.legends_mode === "interactive") {
                        legend.style("cursor","pointer");
                        that.legends_text.style("cursor","pointer");
                    }
                    var legend_container_width = that.legendsGroup.node().getBBox().width, translate_x,translate_y;
                    if(that.legends_display === "vertical") {
                        translate_y = 0;
                        if(PykCharts.boolean(that.data_mode_enable)) { 
                            translate_y = 40;
                        }
                        that.legendsGroup_width = legend_container_width + 20;
                    } else  {
                        translate_y = 0;
                        that.legendsGroup_width = 0;
                    }
                    translate_x = (that.legends_display === "vertical") ? (that.chart_width - that.legendsGroup_width)  : (that.chart_width - legend_container_width - 20);
                    if (legend_container_width < that.chart_width) { that.legendsGroup.attr("transform","translate("+translate_x+"," + translate_y + ")"); }
                    that.legendsGroup.style("visibility","visible");

                    that.legends_text.exit().remove();
                    legend.exit().remove();
                }
                return this;
            },
            dataMode : function () {
                if(PykCharts.boolean(that.data_mode_enable)) {
                    var options = [
                        {
                            "name": "Percentage",
                            "on": that.extended
                        },
                        {
                            "name": "Absolute",
                            "on": !that.extended
                        }
                    ];
                    that.legendsGroup_height = 50;
                    var texts = that.chart_mode_group.selectAll(".data-mode-text").data(options);
                    texts.enter().append("text")

                    texts.attr({
                        "class": "data-mode-text",
                        "fill": that.legends_text_color,
                        "font-family": that.legends_text_family,
                        "font-size": that.legends_text_size +"px",
                        "font-weight": that.legends_text_weight
                    })
                    .text(function(d,i){
                        return d.name;
                    })
                    .attr("transform", function(d, i){
                        return "translate(" + ((i*100) + 20) + ",30)";
                    })
                    .on("click", function(d,i){
                        that.extended = !that.extended;
                        that.draw();
                    });
                    var circles = that.chart_mode_group.selectAll(".data-mode-circles").data(options);
                    circles.enter().append("circle");

                    circles.attr("class","data-mode-circles")
                        .attr("cx", function(d,i){
                            return (i*100)+10;
                        })
                        .attr("cy",(18 + 7.5)).attr("r", 6)
                        .attr("style", function(d){
                            var fill = !d.on ? "transparent" : that.data_mode_legends_color;
                            return "fill: "+ fill +"; stroke-width: 3px; stroke:" + that.data_mode_legends_color;
                        })
                        .on("click", function(d,i){
                            if(that.mode === "default") {
                                that.extended = !that.extended;
                                that.draw();
                            }
                        });
                        texts.style("cursor","pointer");
                        circles.style("cursor","pointer");
                }
                return this;
            }
        };
        return optional;
    };
    that.filter = function(d){
        if(that.filterList.length < 1){
            that.filterList = JSON.parse( JSON.stringify(that.fullList) )
        }

        for(var i in d){
            var media = d[i].breakup;
            var newMedia = [];
            for(var j in media){
                if (inArray(media[j].name, that.filterList) >= 0) newMedia.push(media[j]);
            }
            d[i].breakup = newMedia;
        }
        return d;
    };

    that.onlyFilter = function(f){
        var index = that.filterList.indexOf(f);
        if(that.filterList.length === 1 && index != -1){
            that.filterList = [];
        }else{
            that.filterList = [];
            that.filterList.push(f);
        }
        this.draw();
    };

    that.toggleFilter = function(f){
        var index = that.filterList.indexOf(f);
        if(index === -1){
            that.filterList.push(f);
        }else{
            that.filterList.splice(index, 1);
        }
        that.draw();
    };
    that.totalInBreakup = function(breakup){
        var total = 0;
        for(var i in breakup) total += breakup[i].count; // Add all the counts in breakup to total
        return total;
    };

    that.maxTotal = function(d){
        var totals = [];
        for(var i in d) totals.push(d[i].breakupTotal); // Get all the breakupTotals in an Array
        totals = totals.sort(function(a,b){return a - b;}); // Sort them in ascending order
        return totals[totals.length - 1]; // Give the last one
    };

    that.parseData = function(d){
        for(var i in d) d[i].breakupTotal = this.totalInBreakup(d[i].breakup); // Calculate all breakup totals and add to the hash
        return d;
    };

    function inArray( elem, arr, i ) {
        return arr == null ? -1 : arr.indexOf.call( arr, elem, i );
    }
};
