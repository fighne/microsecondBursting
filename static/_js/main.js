/*
  generated app data
*/
var app = {'data':[],'cData':[]};

function crSeries(data) {
  var dObj = [{
            name: 'Packets',
            type: 'line',
            yAxis: 2,
            data: [],

        }, {
            name: 'Bytes',
            type: 'line',
            yAxis: 1,
            turboThreshold:0,
            data: [],
        },{
            name: 'Flows',
            type: 'line',
            turboThreshold:0,
            data: [],

        }];
  for (var i = 0; i < app.data.length; i++){
    var t = app.data[i].split(',');
	//console.log('>' + t[0]);
    var x = Number( String( t[0].split('.')[1] ).substr(3, 3) );
	//console.log(x)
    dObj[0].data.push({x:x, y:Number( t[1] )});
    dObj[1].data.push({x:x, y:Number( t[2] )});
    dObj[2].data.push({x:x, y:Number( t[3] )});
  }
  return dObj;
}

function filterData() {
	var tPackets = 0, tBytes = 0, tFlows = 0;
  for (var i = 0; i < app.data.length -1; i++){
    var t = app.data[i].split(',');
    app.cData.push({'time':t[0], 'packets':t[1], 'bytes':t[2], 'flows':t[3]});
		if ( tPackets < Number(t[1]) ) { tPackets = Number(t[1]) };
		if ( tBytes < Number(t[2]) ) { tBytes = Number(t[2]) };
		if ( tFlows < Number(t[3]) ) { tFlows = Number(t[3]) };
  }
  $('#packets').html(tPackets);
	$('#bytes').html(tBytes);
	$('#flows').html(tFlows);
}

function selectBuild(name, len, pos, arr) {
  var rStr = "";
  rStr += '<select name="' + name + '" style="padding-left:3px;">';
  for (var i = 0; i < len; i++) {
    rStr += '<option value="' + i + '"';
    if( i === pos) {
      rStr += ' selected' ;
    }
    rStr += '>' + arr[i] + '</option>';
  }
  rStr += '</selected>';
  return rStr;
}

function buildArr(start, size) {
  var rArr = [];
  for( var i = start; i < (start + size); i++){
    rArr.push(i);
  }
  return rArr;
}
/* fv EQU Form Element Value */
function fv(str) {
  var rVal = '', cPos = 0;
  if( str !== 'milliseconds' ) {
    cPos = document.timeframe["tf_" + str].selectedIndex;
    rVal = document.timeframe["tf_" + str].options[cPos].text;
    if ( str === 'month' ) {
      rVal = cPos;
    }
  } 
  else {
    ['tf_mh', 'tf_mt', 'tf_mu'].map( function(id) {
      cPos = document.timeframe[id].selectedIndex;
      rVal += document.timeframe[id].options[cPos].text;
    });
	
  }

  return Number( rVal );
}

/* page script */
$(document).ready( function(){
	

  if ( window.location.search !== '') {

    var tmp = window.location.search.substring(1).split('&'), qData = {};
    for (var i = 0; i < tmp.length; i++) {
      var tArr = tmp[i].split('=');
      qData[tArr[0]] = tArr[1];
    }

  } else {
	$('#datetimepicker10').datetimepicker();
    var c = new Date();
    var cy = c.getFullYear();
    $('#timeframe')
      .append( '<label style="pading-left:7px;">Interface:&nbsp;</label>')
      .append( selectBuild('tf_interface', 4, 0, buildArr(3, 4)) )
      .append( '&nbsp;<label style="pading-left:7px;">Date:&nbsp;</label>')
      .append( selectBuild('tf_year', 2, 1, [cy-1, cy]) )
      .append( selectBuild('tf_month', 12, c.getMonth(), ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']) )
      .append( selectBuild('tf_day', 31, c.getDate()-1, buildArr(1, 31)) )
      .append( '&nbsp;<label style="pading-left:7px;">Time:&nbsp;</label>')
      .append( selectBuild('tf_hours', 24, c.getHours(), buildArr(0, 24)) )
      .append( selectBuild('tf_minutes', 60, c.getMinutes(), buildArr(0, 60)) )
      .append( selectBuild('tf_seconds', 60, c.getSeconds(), buildArr(0, 60)) )
      .append( '&nbsp;<label style="pading-left:7px;">Milliseconds:&nbsp;</label>')
      .append( selectBuild('tf_mh', 10, Number( String( c.getMilliseconds() ).slice(0,1) ), buildArr(0, 10)) )
      .append( selectBuild('tf_mt', 10, Number( String( c.getMilliseconds() ).slice(1,2) ), buildArr(0, 10)) )
      .append( selectBuild('tf_mu', 10, Number( String( c.getMilliseconds() ).slice(-1) ), buildArr(0, 10)) )
	  /*
      .append( '<br> <label for="ip">IP address&nbsp;</label> ')
      .append( '<input type="text" name="tf_ip" id="tf_ip" size="15" value="000.000.000.000"> ')
      .append( '<br> <label for="port">Port:</label>')
      .append( '<input type="text" name="tf_port" id="tf_port" size="5" value="80"> ')
	  */
      .append( '&nbsp;<button type="submit" value="Submit">Submit</button> ');

      $('#timeframe').on('submit', function(e) {
        e.preventDefault();
        var d = new Date( Date( fv('year'), fv('month'), fv('day'), fv('hours'), fv('minutes'), fv('seconds'), fv('milliseconds') ) );
		/*
        $('div#selectForm form').css('display', 'none');
        $('div#selectLoading').css( 'display', 'block');
		*/
        $.get('/cgi-bin/cgi.sh', { 'probe' : fv('interface'), 'time' : d.valueOf()/*, 'ip' : document.timeframe.tf_ip.value, 'port' : document.timeframe.tf_port.value, 'rate' : 'ms' */}, function(data) {
        })
        .done( function(data) {
			/*
          $('div#selectForm').html('<p>data capture success</p>');
          $('div#selectForm form').css('display', 'block');
          $('div#selectLoading').css( 'display', 'none');
			*/
          $.get('output.txt', function(data) {
            data = data.replace(/\s{2,}/g, ',');
            app.data = data.split('\n');
            filterData();
            buildChart();
          }, 'text');
        })
        .fail( function() {
			/*
          $('div#selectForm').html('<p>data capture failure</p>');
          $('div#selectForm form').css('display', 'block');
          $('div#selectLoading').css( 'display', 'none');
			*/
        });
        return false;
      });

  }
 
  function buildChart() {
	var cData = crSeries(app.data);

    $('#container').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' :
                        'Pinch the chart to zoom in'
            },
            xAxis: {
                minRange: 100 // 100 units
            },
            yAxis: [{ // Primary yAxis
                        labels: {
                            format: '{value}',
                            style: {
                                color: Highcharts.getOptions().colors[2]
                            }
                        },
                        title: {
                            text: 'Flows count',
                            style: {
                                color: Highcharts.getOptions().colors[2]
                            }
                        },
                        opposite: false
                    }, { // Secondary yAxis
                        title: {
                            text: 'Bytes total',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        labels: {
                            format: '{value} bytes',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
												opposite: false
                    }, { // Secondary yAxis
                        title: {
                            text: 'Packets total',
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        labels: {
                            format: '{value} total',
                            style: {
                                color: Highcharts.getOptions().colors[0]
                            }
                        },
                        opposite: false
                    }], 
                    tooltip: {
                        shared: true
                    },
            legend: {
                enabled: true
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: cData
        });
  }

});
