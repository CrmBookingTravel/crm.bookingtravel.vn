const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');

console.log('advanceBookingStatus:', content.includes('function advanceBookingStatus'));
console.log('validateBookingCompletion:', content.includes('function validateBookingCompletion'));
console.log('openWorkflowStatusModal:', content.includes('function openWorkflowStatusModal'));
console.log('modal-workflow-status:', content.includes('modal-workflow-status'));
console.log('getBookingStatusMeta:', content.includes('function getBookingStatusMeta'));
console.log('BOOKING_WORKFLOW_STEPS:', content.includes('BOOKING_WORKFLOW_STEPS'));
