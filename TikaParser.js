const spawn = require('child_process').spawn;
const EventEmitter = require('events');

class TikaParser extends EventEmitter {
    constructor() {
        super();
    }

    parse(file) {
        let self = this;
        let tika = spawn('java', ['-jar', __dirname + '/tika-app-1.21.jar', '-t', file]);
        // set up a variable on per instance scope for storing text
        tika.stdout.parse_text = '';

        tika.stdout.on('data', function (data) {
            // aggregate all output text from the parse
            this.parse_text += data;
        });

        tika.stderr.on('data', function (error) {
            // console.log("STDERR:::", error);
            self.emit('error', error);
        });

        tika.on('exit', function (code) {
            if (code === 0) {
                if (!!this.stdout.parse_text && this.stdout.parse_text.trim() !== "") {
                    self.emit('data', this.stdout.parse_text);
                } else {
                    self.emit('error', "No data found");
                }
            }
            self.emit('exit', code);
        });

        return self;
    }
}

module.exports = TikaParser;