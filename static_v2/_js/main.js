/*
  main.js - pete fighne
*/

$(document).ready( function(){

  // Bootstrap plugin + native library activation
  $(function () { $('#datetimepicker1').datetimepicker(); });
  $('.btn').button();
  $('.dropdown-toggle').dropdown();


  // Navigation Bar panel switching - ( none Bootstrap )
  var navBarElements = $('div.navbar.navbar-default.navbar-fixed-top div.container div.navbar-collapse.collapse ul.nav.navbar-nav li');
  var panelElements = $('div.container div.panel.panel-default');
  navBarElements.on('click', function(e) {
    navBarElements.removeClass('active');
    $(this).addClass('active');
    panelElements.addClass('hidden');
    var panelName = e.currentTarget.firstChild.firstChild.data;
    panelElements.each( function(index) {
      if($(panelElements[index]).find('div.panel-heading h3.panel-title').html() === panelName) {
        $(panelElements[index]).removeClass('hidden');
      }
    });
  });

  function gatherParameters () {
    document.parameterForm.parameter_1.value = $('#probeSpan').html();
    document.parameterForm.parameter_2.value = $('#datetimepicker1 input').val();
    document.parameterForm.parameter_3.value = $('#timeSpan').html();
    document.parameterForm.parameter_4.value = $('#timeSeconds').val();
    $('#timeSpan').html() === 'Seconds' ? document.parameterForm.parameter_5.value = "000" : document.parameterForm.parameter_5.value = $('#timeMilliseconds').val();
    document.parameterForm.parameter_6.value = $('#ipAddress').val();
    $('#spanPorts').html() === "All Ports"  ? document.parameterForm.parameter_7.value = "n/a" : document.parameterForm.parameter_7.value = $('#portNumber').val();
    document.parameterForm.parameter_8.value = $('#spanTraffic').html();
  }

  $('#parameterSubmit').on('click', function () {

  });

  $('#parameterPanelShow').on('click', function(){
    panelElements.addClass('hidden');
    gatherParameters();
    $('#parameterPanel').removeClass('hidden');
  });

  function restorePanels () {
     $('#parameterPanel').addClass('hidden');
    navBarElements.each( function(index) {
      if( $(navBarElements[index]).hasClass('active') ) {
        $(panelElements[index]).removeClass('hidden');
      }
    });
  }

  $('#parameterPanelHide').on('click', restorePanels);

  // Timing panel gui elements
  var timingElements = "div.container div.panel.panel-default#capturePanel div.panel-body div.container div.row";

  function toggleRange () {
    $(timingElements + ' div.col-sm-3:nth-child(3)').toggleClass( 'hidden' );
    $(timingElements + ' div.col-sm-2').toggleClass(  'hidden' );
    $('#timeSpan').html() === "Seconds" ? $('#timeSpan').html("Milliseconds") : $('#timeSpan').html("Seconds") ;
  }

  $(timingElements + ' div.col-sm-3 div.btn-group button.btn.btn-default:nth-child(1)').on('click', toggleRange);

  // Filter panel gui elements
  var filterElements = "div.container div.panel.panel-default#filterPanel div.panel-body div.container div.row";

  function togglePorts () {
    $('#portInput').toggleClass( 'hidden' );

    $('#spanPorts').html() === "All Ports" ? $('#spanPorts').html("Port") : $('#spanPorts').html("All Ports");
  }

  $('#showPortInput').on('click', togglePorts);

  $(filterElements + ' div.col-sm-2 div.btn-group ul.dropdown-menu li a').on('click', function(e) {
    $('#spanTraffic').html(e.currentTarget.firstChild.data);
  });

  $('ul.dropdown-menu#probeOptionList li a').on('click', function (e) {
    $('#probeSpan').html(e.currentTarget.firstChild.data);
  });

});
