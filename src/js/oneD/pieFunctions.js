PykCharts.oneD.pieFunctions = function (options,chartObject,type) {
    var that = chartObject;
       that.refresh = function (pykquery_data) {
        that.executeRefresh = function (data) {
            that.data = that.k.__proto__._groupBy("oned",data);
            that.clubdata_enable = that.data.length>that.clubdata_maximum_nodes ? that.clubdata_enable : "no";
            that.refresh_data = that.k.__proto__._groupBy("oned",data);
            var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data)
                , shade_array = [];
            that.compare_data = compare[0];
            var data_changed = compare[1];
            if(data_changed) {
                that.k.lastUpdatedAt("liveData");
            }
            that.new_data = that.optionalFeatures().clubData();
            that.optionalFeatures()
                    .createChart(shade_array)
                    .label()
                    .ticks()
                    .centerLabel();
        };
        if (PykCharts['boolean'](that.interactive_enable)) {
            that.k.dataFromPykQuery(pykquery_data);
            that.k.dataSourceFormatIdentification(that.data,that,"executeRefresh");
        } else {
            that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
        }   
    };

    this.render = function() {
        that.count = 1;
        var id = that.selector.substring(1,that.selector.length);
        var container_id = id + "_svg"
            , shade_array = [];
        that.fillChart = new PykCharts.Configuration.fillChart(that);
        that.transitions = new PykCharts.Configuration.transition(that);

        if(that.mode.toLowerCase() === "default") {

            that.k.title()
                .backgroundColor(that)
                .export(that,"#"+container_id,type)
                .emptyDiv(that.selector)
                .subtitle();

            that.optionalFeatures().svgContainer(container_id);
            that.new_data = that.optionalFeatures().clubData();
            
            that.k.createFooter()
                    .lastUpdatedAt()
                    .credits()
                    .dataSource()
                    .tooltip();


            that.optionalFeatures()
                    .set_start_end_angle()
                    .createChart(shade_array)
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.liveData(that);

        } else if(that.mode.toLowerCase() === "infographics") {
            that.new_data = that.data;
            that.k.backgroundColor(that)
                .export(that,"#"+container_id,type)
                    .emptyDiv(that.selector);
            that.optionalFeatures().svgContainer(container_id)
                    .set_start_end_angle()
                    .createChart(shade_array)
                    .label()
                    .ticks()
                    .centerLabel();

            that.k.tooltip();
        }

        that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        var add_extra_width = 0;
        var add_extra_height = 0;
        setTimeout(function () {
            if(that.ticks_text_width.length) {
                add_extra_width = d3.max(that.ticks_text_width,function(d) {
                    return d;
                });
                add_extra_height = that.ticks_text_height;
            }
            that.k.exportSVG(that,"#"+container_id,type,undefined,undefined,(add_extra_width+20),(add_extra_height+20))
        },that.transitions.duration());

        var resize = that.k.resize(that.svgContainer);
        that.k.__proto__._ready(resize);
        window.addEventListener('resize', function(event){
            return that.k.resize(that.svgContainer);
        });
    };

    that.optionalFeatures = function () {
        var optional = {
            svgContainer :function (container_id) {
                that.svgContainer = d3.select(that.selector)
                    .append('svg')
                    .attr({
                        "width": that.chart_width,
                        "height": function () {
                            return that.chart_height;
                        },
                        "preserveAspectRatio": "xMinYMin",
                        "viewBox": "0 0 " + that.chart_width + " " + that.chart_height,
                        "id": container_id,
                        "class": "svgcontainer PykCharts-oneD"
                    });
                that.group = that.svgContainer.append("g")
                    .attr({
                        "transform": "translate("+(that.chart_width/2)+","+that.height_translate+")",
                        "id": "pieGroup"
                    });

                return this;
            },
            createChart : function () {
                document.querySelector(that.selector +" #pieGroup").innerHTML = null;
                var border = new PykCharts.Configuration.border(that);
                if(that.color_mode === "shade") {
                    shade_array = that.k.shadeColorConversion(that.shade_color,that.new_data.length);
                    that.new_data.forEach(function (d,i) {
                        d.color = shade_array[i];
                    })
                }
                if(type.toLowerCase() === "pie" || type.toLowerCase() === "donut") {
                    that.new_data.sort(function (a,b) { return a.weight - b.weight;});
                    var temp = that.new_data.pop();
                    that.new_data.unshift(temp);
                    if(PykCharts['boolean'](that.clubdata_enable) && that.mode === "default") {
                        var index,data;
                        for(var i = 0;i<that.new_data.length;i++) {
                            if(that.new_data[i].name === that.clubdata_text) {
                                index = i;
                                data = that.new_data[i];
                                break;
                            }
                        }
                        if(index) {
                            that.new_data.splice(index,1);
                            if(i===0) {
                                var temp = that.new_data.pop();
                                that.new_data.splice(0,0,temp);
                            }
                            that.new_data.splice(1,0,data);
                        }
                    }
                } else if(type.toLowerCase() == "election pie" || type.toLowerCase() == "election donut") {
                    that.new_data.sort(function (a,b) { return b.weight - a.weight;});
                    if(PykCharts['boolean'](that.clubdata_enable) && that.mode === "default") {
                        var index,data;
                        for(var i = 0;i<that.new_data.length;i++) {
                            if(that.new_data[i].name === that.clubdata_text) {
                                index = i;
                                data = that.new_data[i];
                                break;
                            }
                        }
                        if(index) {
                            that.new_data.splice(index,1);
                            that.new_data.push(data);
                        }
                    }
                }

                that.sum = 0;
                for(var i = 0,len=that.new_data.length;i<len;i++) {
                    that.sum+=that.new_data[i].weight;
                }
                that.inner_radius = that.k.__proto__._radiusCalculation(that.innerRadiusPercent,that.calculation);
                that.outer_radius = that.k.__proto__._radiusCalculation(that.pie_radius_percent,that.calculation);

                that.arc = d3.svg.arc()
                    .innerRadius(that.inner_radius)
                    .outerRadius(that.outer_radius);

                that.pie = d3.layout.pie()
                    .value(function (d) { return d.weight; })
                    .sort(null)
                    .startAngle(that.start_angle)
                    .endAngle(that.end_angle);

                that.chart_data = that.group.selectAll("path").
                                        data(that.pie(that.new_data));

                that.chart_data.enter()
                    .append("path");

                that.chart_data
                    .attr("class","pie");

                that.chart_data
                    .attr({
                        "fill": function (d,i) {
                            return that.fillChart.selectColor(d.data);
                        },
                        "fill-opacity": 1,
                        "data-fill-opacity": function () {
                            return d3.select(this).attr("fill-opacity");
                        },
                        "stroke": border.color(),
                        "stroke-width": border.width(),
                        "stroke-dasharray": border.style(),
                        "data-id" : function (d) {
                            return d.data.name;
                        }
                    })
                    .on({
                        'mouseover': function (d) {
                            if(that.mode === "default") {
                                d.data.tooltip = d.data.tooltip || "<table class='PykCharts'><tr><th colspan='2' class='tooltip-heading'>"+d.data.name+"</tr><tr><td class='tooltip-left-content'>"+that.k.appendUnits(d.data.weight)+"<td class='tooltip-right-content'>("+((d.data.weight*100)/that.sum).toFixed(1)+"%) </tr></table>";
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlight(that.selector +" "+".pie", this);
                                }
                                that.mouseEvent.tooltipPosition(d);
                                that.mouseEvent.tooltipTextShow(d.data.tooltip);
                            }
                        },
                        'mouseout': function (d) {
                            if(that.mode === "default") {
                                if(PykCharts['boolean'](that.chart_onhover_highlight_enable)) {
                                    that.mouseEvent.highlightHide(that.selector +" "+".pie");
                                }   
                                that.mouseEvent.tooltipHide(d);
                            }
                        },
                        'mousemove': function (d) {
                            if(that.mode === "default") {
                                that.mouseEvent.tooltipPosition(d);
                            }
                        },
                        'click' :  function (d) {
                            if(PykCharts['boolean'](that.click_enable)){
                                that.addEvents(d.data.name, d3.select(this).attr("data-id"));
                            }
                        }
                    });

                that.chart_data.transition()
                    .delay(function(d, i) {
                        if(that.transition_duration && that.mode === "default") {
                            return (i * that.transition_duration * 1000)/that.new_data.length;
                        } else return 0;
                    })
                    .duration(that.transitions.duration()/that.new_data.length)
                    .attrTween("d",function(d) {
                        var i = d3.interpolate(d.startAngle, d.endAngle);
                        return function(t) {
                            d.endAngle = i(t);
                            return that.arc(d);
                        }
                    });

                that.chart_data.exit().remove();
                return this;
            },
            label : function () {
                that.chart_text = that.group.selectAll("text")
                                   .data(that.pie(that.new_data));

                that.chart_text.enter()
                    .append("text")
                    .attr({
                        "class": "pie-label",
                        "transform": function (d) { return "translate("+that.arc.centroid(d)+")"; }
                    });

                that.chart_text.attr("transform",function (d) { return "translate("+that.arc.centroid(d)+")"; });

                that.chart_text.text("");

                function chart_text_timeout() {
                    that.chart_text
                        .style({
                            "font-weight": that.label_weight,
                            "font-size": that.label_size + "px",
                            "font-family": that.label_family
                        })
                        .text(function (d) {
                            return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
//                            return that.k.appendUnits(d.data.weight); 
                        })
                        .attr({
                            "text-anchor": "middle",
                            "pointer-events": "none",
                            "dy": 5,
                            "fill": function (d) {
                                if(that.color_mode === "shade" && !options.label_color) {
                                    var color_value = that.k.__proto__._colourBrightness(d.data.color);
                                    if(color_value === "light") {
                                        return "black";
                                    } else {
                                        return "white";
                                    }
                                }
                                return that.label_color;
                            }
                        })
                        .text(function (d,i) {
                            if(type.toLowerCase() === "pie" || type.toLowerCase() === "election pie") {
                                if(this.getBBox().width<((d.endAngle-d.startAngle)*((that.outer_radius/2)/**0.9*/))) {
                                    return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                }
                                else {
                                    return "";
                                }
                            } else {
                                if((this.getBBox().width < (Math.abs(d.endAngle - d.startAngle)*that.outer_radius*0.9))  && (this.getBBox().height < (((that.outer_radius-that.inner_radius)*0.75)))) {
                                    return ((d.data.weight*100)/that.sum).toFixed(1)+"%";
                                }
                                else {
                                    return "";
                                }
                            }
                        });
                        that.chart_text.exit().remove();
                    }
                    setTimeout(chart_text_timeout,that.transitions.duration());

                return this;
            },
            clubData: function () {
                if(PykCharts['boolean'](that.clubdata_enable)) {
                    var clubdata_content = [];
                    if(that.clubdata_always_include_data_points.length!== 0){
                        var l = that.clubdata_always_include_data_points.length;
                        for(i=0; i < l; i++){
                            clubdata_content[i] = that.clubdata_always_include_data_points[i];
                        }
                    }
                    var new_data1 = [];
                    for(i=0;i<clubdata_content.length;i++){
                        for(j=0;j<that.data.length;j++){
                            if(clubdata_content[i].toUpperCase() === that.data[j].name.toUpperCase()){
                                new_data1.push(that.data[j]);
                            }
                        }
                    }
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    var k = 0;

                    while(new_data1.length<that.clubdata_maximum_nodes-1){
                        for(i=0;i<clubdata_content.length;i++){
                            if(that.data[k].name.toUpperCase() === clubdata_content[i].toUpperCase()){
                                k++;
                            }
                        }
                        new_data1.push(that.data[k]);
                        k++;
                    }
                    var sum_others = 0;
                    for(j=k; j < that.data.length; j++){
                        for(i=0; i<new_data1.length && j<that.data.length; i++){
                            if(that.data[j].name.toUpperCase() === new_data1[i].name.toUpperCase()){
                                sum_others +=0;
                                j++;
                                i = -1;
                            }
                        }
                        if(j < that.data.length){
                            sum_others += that.data[j].weight;
                        }
                    }
                    var sortfunc = function (a,b) { return b.weight - a.weight; };

                    while(new_data1.length > that.clubdata_maximum_nodes){
                        new_data1.sort(sortfunc);
                        var a=new_data1.pop();
                    }
                    var others_Slice = { "name":that.clubdata_text, "weight": sum_others,/* "color": that.clubdata_color,*/ "tooltip": that.clubdata_tooltip };
                    new_data1.sort(function(a,b){
                        return b.weight - a.weight;
                    })
                    if(new_data1.length < that.clubdata_maximum_nodes){
                        new_data1.push(others_Slice);
                    }
                    that.new_data = new_data1;
                }
                else {
                    that.data.sort(function (a,b) { return b.weight - a.weight; });
                    that.new_data = that.data;
                }
                return that.new_data;
            },
            ticks : function () {
                if(PykCharts['boolean'](that.pointer_overflow_enable)) {
                    that.svgContainer.style("overflow","visible");
                }
                var w = [];
                that.ticks_text_width = [];
                    var tick_label = that.group.selectAll(".ticks_label")
                                    .data(that.pie(that.new_data));

                    tick_label.attr("class","ticks_label");

                    tick_label.enter()
                        .append("text")
                        .attr({
                            "x": 0,
                            "y": 0
                        });

                    var x,y;
                    tick_label.attr("transform",function (d) {
                        if (d.endAngle - d.startAngle < 0.2) {
                             x = (that.outer_radius +30 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.outer_radius/1+20) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        } else {
                             x = (that.outer_radius +22 ) * (1) * Math.cos((d.startAngle + d.endAngle - Math.PI)/2);
                             y = (that.outer_radius/1+24) * (1) * Math.sin((d.startAngle + d.endAngle -  Math.PI)/2);
                        }
                        return "translate(" + x + "," + y + ")";});

                    tick_label.text("")
                    function tick_label_timeout() {
                        tick_label.text(function(d) { return d.data.name; })
                            .text(function(d,i) {
                                that.ticks_text_width[i] = this.getBBox().width;
                                that.ticks_text_height = this.getBBox().height;
                                return d.data.name;
                            })
                            .attr({
                                "text-anchor": function(d) {
                                    var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                                    if (rads>0 && rads<2) {
                                        return "start";
                                    } else if (rads>=1.5 && rads<3.5) {
                                        return "middle";
                                    } else if (rads>=3.5 && rads<6) {
                                        return "end";
                                    } else if (rads>=6) {
                                        return "middle";
                                    } else if(type ==="election pie" || type === "election donut" && rads < -1) {
                                        return "end";
                                    } else if(rads<0) {
                                        return "middle";
                                    } 
                                },
                                "dy": 5,
                                "pointer-events": "none"
                            })
                            .style({
                                "fill": that.pointer_color,
                                "font-size": that.pointer_size + "px",
                                "font-weight": that.pointer_weight,
                                "font-family": that.pointer_family
                            });

                        tick_label.exit().remove();
                    }
                    setTimeout(tick_label_timeout,that.transitions.duration());


                    var tick_line = that.group.selectAll("line")
                        .data(that.pie(that.new_data));

                    tick_line.enter()
                        .append("line")
                        .attr("class", "ticks");

                    tick_line.attr({
                        "x1": function (d,i) {
                            return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        },
                        "y1": function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        },
                        "x2": function (d,i) {
                            return (that.outer_radius) * (1)* Math.cos((d.startAngle + d.endAngle)/2);
                        },
                        "y2": function (d,i) {
                            return (that.outer_radius) * (1) *Math.sin((d.endAngle + d.startAngle )/2);
                        }
                    });
                    function tick_line_timeout() {
                        tick_line.attr({
                            "x2": function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.cos((d.startAngle + d.endAngle)/2);
                            },
                            "y2": function (d, i) {
                                return (that.outer_radius/1+12)* (1) * Math.sin((d.startAngle + d.endAngle)/2);
                            },
                            "transform": "rotate(-90)",
                            "stroke-width": that.pointer_thickness + "px",
                            "stroke": that.pointer_color
                        });
                        tick_line.exit().remove();
                    }

                    setTimeout(tick_line_timeout,that.transitions.duration());
                return this;
            },
            centerLabel: function () {
                if(PykCharts['boolean'](that.show_total_at_center) && (type === "donut" || type === "election donut")) {

                    var h;
                    var label = that.group.selectAll(that.selector +" "+".centerLabel")
                                    .data([that.sum]);

                    label.enter()
                        .append("text");

                    label.attr("class","centerLabel")
                        .text("");

                    function label_timeout() {
                        label.text( function(d) {
                                return that.k.appendUnits(that.sum);
                            })
                            .text( function(d) {
                                h = this.getBBox().height;
                                return that.k.appendUnits(that.sum);
                            })
                            .attr({
                                "pointer-events": "none",
                                "text-anchor": "middle",
                                "y": function () {
                                    return (type === "donut") ? h/2 : (-0.25*that.inner_radius);
                                },
                                "fill": that.show_total_at_center_color
                            })
                            .style({
                                "font-family": that.show_total_at_center_family,
                                "font-weight": that.show_total_at_center_weight,
                                "font-size": that.show_total_at_center_size + "px"
                            });

                    }
                    setTimeout(label_timeout,that.transitions.duration());

                    label.exit().remove();
                }
                return this;
            },
            set_start_end_angle: function () {
                that.startAngle, that.endAngle;
                if(type === "pie" || type === "donut") {
                    that.start_angle = (0 * (Math.PI/180));
                    that.end_angle = (360 * (Math.PI/180));
                } else if(type === "election pie" || type === "election donut") {
                    that.start_angle = (-90 * (Math.PI/180));
                    that.end_angle = (90 * (Math.PI/180));
                }
                return this;
            }
        };
        return optional;
    };
};
