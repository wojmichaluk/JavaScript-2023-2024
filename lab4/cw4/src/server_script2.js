import http from "node:http";
import { URL } from "node:url";
import { readFile, appendFile } from "node:fs";

import { JSDOM } from "jsdom";
const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Księga gości</title>
  </head>
  <body>
    <div id="root"></div>
    <hr>
    <div style="font-size:24px; margin:8px">Nowy wpis:</div>
    <form method="GET" action="/submit" style="margin:8px">
      <label for="name">Twoje imię i nazwisko</label><br>
      <input type="text" name="name" style="width:100%" placeholder="Jerzy Wiśniewski"><br><br>
      <label for="area">Treść wpisu</label><br>
      <textarea name="area" rows=5 style="width:100%" placeholder="Proszę o kontakt osoby, które ze mną studiowały — tel. 12 345 67 89"></textarea><br><br>
      <button id="btn" type="submit" style="background-color:#edb826; padding:8px">Dodaj wpis</button>
    </form>
  </body>
</html>`);

/**
 * Handles incoming requests to the page containing information about its previous visitors, who can leave comments.
 * The comments are stored in a text file and loaded. New comments can be added via a form.
 *
 * @param {IncomingMessage} request - Input stream — contains data received from the browser, e.g. 
 * encoded contents of HTML div container and form fields.
 * @param {ServerResponse} response - Output stream — put in it data that you want to send back to the browser.
 * The answer sent by this stream must consist of two parts: the header and the body. It is based on Node.js `jsdom` module. 
 * <ul>
 *  <li>The header contains, among others, information about the type (MIME) of data contained in the body.
 *  <li>The body contains the correct data, e.g. a div to store previously given data and form definition.
 * </ul>
 */

function visitorsRequestListener(request, response) {
  console.log("--------------------------------------");
  console.log(`The relative URL of the current request: ${request.url}`);
  console.log(`Access method: ${request.method}`);
  console.log("--------------------------------------")

  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname !== "/favicon.ico")
    console.log(url);

  switch ([request.method, url.pathname].join(" ")) {
    case "GET /":
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

			readFile("ksiega_gosci.txt", "utf-8", function (err, data) {
				if (err) {
					throw err;
				}

        const container = dom.window.document.querySelector('#root');
        container.innerHTML = '';
        data.replace('\r', '');
        const data_array = data.split('\n');
        
        for (let i = 0; i < data_array.length; i++) {
          switch (i % 3) {
            case 0:
              var h1 = dom.window.document.createElement("h1");
              var hText = dom.window.document.createTextNode(data_array[i]);
              h1.appendChild(hText);
              container.appendChild(h1);
              break;

            case 1:
              var par = dom.window.document.createElement("p");
              var parText = dom.window.document.createTextNode(data_array[i]);
              par.appendChild(parText);
              container.appendChild(par);
              break;

            default:
              break;
          }
        }

        response.write(dom.serialize());
        response.end();
			});

      break;

    case "GET /submit":
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

      var name = url.searchParams.get("name");
      var area = url.searchParams.get("area")
        .replace('\r', '')
        .split('\n')
        .join(' ');
      var data = '\n' + name + '\n' + area + '\n';

      appendFile("ksiega_gosci.txt", data, function (err) {
				if (err) {
					throw err;
				}

        response.write("Dodano wpis!\n");
        response.write(`Imię i nazwisko: ${name}\n`);
        response.write(`Treść wpisu: ${area}\n`);
        response.end();
      })

      break;

    default:
      response.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
      response.write("Error 501: Not implemented");
      response.end();
  }
}

const server = http.createServer(visitorsRequestListener);
server.listen(8000);
console.log("The server was started on port 8000");
console.log('To stop the server, press "CTRL + C"');
