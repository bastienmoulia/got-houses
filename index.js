var fs = require('fs');
var Mustache = require('mustache');
var svg2png = require('svg2png');
var base64Img = require('base64-img');

const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

let html = '<html><head></head><body>'

fs.readFile('template.svg', function (err, data) {
  if (err) throw err;
  fs.readdir('houses', function(err, files) {
    files.forEach((file) => {
      
      var filePath = 'houses/' + file;
      fs.stat(filePath, function(err, stat) {
        if (stat.isDirectory()) {
          html += '<img src="png/' + file + '.png" alt="' + file + '">';
          var obj = JSON.parse(fs.readFileSync('houses/' + file + '/data.json', 'utf8'));
          obj.house = file;
          obj.dir = '../../';
          obj.height = 600;
          obj.width = 400;
          obj.font = fs.readFileSync('assets/got.ttf.base64');
          obj.logoGot = fs.readFileSync('assets/got-logo.svg');
          obj.logoHouse = base64Img.base64Sync('houses/' + file + '/logo.png');
          obj.texture = base64Img.base64Sync('assets/texture.png');
          var output = Mustache.render(data.toString(), obj);
          fs.writeFile('dist/svg/' + file + '.svg', output, function(err) {
            if(err) {
              return console.log(err);
            }
          });
          svg2png(output)
            .then(buffer => {
              fs.writeFile('dist/png/' + file + '.png', buffer, function(err) {
                if(err) {
                  return console.log(err);
                }
              });
            })
            .catch(e => console.error(e));
          
          console.log(file);
        }
        html += '</body>';
        
        fs.writeFile('dist/index.html', html, function(err) {
          if(err) {
            return console.log(err);
          }
        });
      });
    })
  }); 
});

