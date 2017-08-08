var expect = require('expect');
var {generateMessage} = require('./message.js');


describe('generateMessage', () =>{
	it('should generate the correct message object', () => {
		var message = generateMessage('brandon', 'hey');

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({
			from: 'brandon',
			text: 'hey'
		});
	});
});