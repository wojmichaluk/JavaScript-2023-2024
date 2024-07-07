import { readFileSync, writeFileSync, readFile, writeFile } from "node:fs";
import { exec } from "node:child_process";

if (process.argv.length > 3) {
    process.stdout.write("Nieprawidłowa liczba argumentów");
} else if (process.argv.length === 2) {
    console.log("Wprowadź komendy — naciśnięcie Ctrl+C kończy wprowadzanie danych");

    process.stdin.on('readable', function() {
        let command;

        while((command = process.stdin.read()) != null) {
            let cmd = exec(command.toString(), (err, output) => {
              if (err) {
                throw(err);
              }

              console.log('   ' + output.replaceAll('\n', ' '));
            });

            /*cmd.on("close", (code) => {
              console.log("process has exited");
            });*/

            setTimeout(() => {
              cmd.kill();
            }, 1000);
        }
    });
} else {
    if (process.argv[2] === '--sync') {
        let counter = readFileSync("licznik.txt");

        counter = +counter + 1;
        process.stdout.write("Liczba uruchomień: " + counter);

        writeFileSync("licznik.txt", counter.toString());
    } else if (process.argv[2] === '--async') {
        readFile("licznik.txt", "utf-8", function(err, counter) {
            if (err) {
                throw(err);
            }

            counter = +counter + 1;
            process.stdout.write("Liczba uruchomień: " + counter);

            writeFile("licznik.txt", counter.toString(), function(err) {
                if (err) {
                    throw(err);
                }
            })
        })
    } else {
        process.stdout.write("Nieprawidłowy argument wywołania");
    }
}
