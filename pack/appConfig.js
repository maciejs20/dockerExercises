// moduł zarządza konfiguracją programu
// -------------------------------------

const path = require("path");
const config = require("config");
const sprintf = require("sprintf-js").sprintf;

class AppConfig {
  // ustawienia z pliku muszą być zapisane w config/default.json
  _configMode;
  get configMode() {
    return this._configMode;
  }
  set configMode(value) {
    this._configMode = value;
  }

  // srodowisko startowe zachowujemy jeśli w trybie ENV
  _startupEnv = "";
  get startupEnv() {
    return this._startupEnv;
  }
  set startupEnv(value) {
    this._startupEnv = value;
  }

  // ściezka do plików którymi mamy serwować
  _filePath;
  get filePath() {
    return this._filePath;
  }
  set filePath(value) {
    this._filePath = path.join(__dirname, value);
    console.log("- Set file path to: ", this._filePath);
  }

  // port na którym mamy nasłuchiwać
  _appPort;
  get appPort() {
    return this._appPort;
  }
  set appPort(value) {
    console.log("- Set app port to: ", value);
    this._appPort = value;
  }

  _username;
  get username() {
    return this._username;
  }
  set username(value) {
    console.log("- Set username to: ", value);
    this._username = value;
  }

  _password;
  get password() {
    return this._password;
  }
  set password(value) {
    console.log("- Set password.");
    this._password = value;
  }


  // Czy wymuszamy autoryzację uzytkownikow
  _authRequired;
  get authRequired() {
    return this._authRequired;
  }
  set authRequired(value) {
    if (value === "true" || value === "false") {
      // zamiana na boolean
      value = value === "true";
    }
    // sprawdzamy poprawnosc argumentów
    if (value === true || value === false) {
      this._authRequired = value;
      console.log("- Set basic auth: " + this.authRequired);
    } else {
      console.log("AUTHREQUIRED param has to be true or false, got: "+value);
      process.exit(1);
    }
  }

  constructor(value) {
    // if no value provided - use data from config file
    // if value provided - it has to be process.env

    if (!value) {
      // process config file
      console.log("Setting config mode to FILE");
      this.configMode = "FILE";

      // is config file complete?
      var isConfigValid = true;
      // failure message
      var failReason = "";

      if (config.has("App.filePath")) {
        this.filePath = config.get("App.filePath");
      } else {
        isConfigValid = false;
        failReason += " no App.filePath";
      }

      if (config.has("App.appPort")) {
        this.appPort = config.get("App.appPort");
      } else {
        isConfigValid = false;
        failReason += " no App.appPort";
      }

      if (config.has("App.username")) {
        this.username = config.get("App.username");
      } else {
        isConfigValid = false;
        failReason += " no App.username";
      }

      if (config.has("App.password")) {
        this.password = config.get("App.password");
      } else {
        isConfigValid = false;
        failReason += " no App.password";
      }

      if (config.has("App.authRequired")) {
        this.authRequired = config.get("App.authRequired");
      } else {
        isConfigValid = false;
        failReason += " no App.authRequired";
      }

      if (!isConfigValid) {
        console.log("Error: invalid config file entry: " + failReason);
        process.exit(1);
      }
    } else {
      // process ENV settings
      console.log("Setting config mode to ENV");
      // katalog dla plików
      this.filePath = value.FILEDIR || "files";
      // listening port
      this.appPort = value.PORT || 8081;
      // autentykacja
      this.username = value.USERNAME || "student";
      this.password = value.PASSWORD || "student";
      // czy wymagamy autentykacji?
      this.authRequired = value.AUTHREQUIRED || false;

      //sort env entries
      let keysSorted = Object.keys(value).sort(function (a, b) {
        return a.localeCompare(b);
      });

      //print them out
      let mainthis = this;
      keysSorted.forEach(function (key) {
        mainthis.startupEnv =
          mainthis.startupEnv +
          sprintf("    %20s: %20s<br>", key, value[key].substring(0, 20));
      });

      this.configMode = "ENV";
    }
  }
}

module.exports = {
  AppConfig,
};
