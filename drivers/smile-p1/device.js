'use strict';

const Homey = require('homey');
const PlugwiseDevice = require('../../lib/PlugwiseDevice');

module.exports = class PlugwiseSmileP1Device extends PlugwiseDevice {
	
	onPoll({ payload }) {
  	super.onPoll({ payload });
  	
  	if(!payload) return;  	
  	const { location } = payload;
  	const { logs } = location;
  	if(!logs) return;
  	    
    if( Array.isArray(logs.point_log) ) {
       const log = logs.point_log.filter(log => {
         if( log.type === 'electricity_consumed'
          && log.unit === 'W'
          && log.period
          && log.period.measurement ) return true;
       }).pop();
            
       if( log ) {    
         const value = log.period.measurement.reduce((total, item) => {
           return total + parseFloat(item.$text);
         }, 0);
         this.setCapabilityValue('measure_power', value).catch(this.error);
       }
    }
  	    
    if( Array.isArray(logs.cumulative_log) ) {
       const log = logs.cumulative_log.filter(log => {
         if( log.type === 'electricity_consumed'
          && log.unit === 'Wh'
          && log.period
          && log.period.measurement ) return true;
       }).pop();
       
       if( log ) {                
         const value = log.period.measurement.reduce((total, item) => {
           return total + parseFloat(item.$text) / 1000;
         }, 0);
         this.setCapabilityValue('meter_power', value).catch(this.error);
       }
    }
	}
	
}