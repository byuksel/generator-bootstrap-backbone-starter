var chalk = require('chalk'),
    generators = require('yeoman-generator'),
    us = require('underscore.string');

exports = module.exports = generators.Base.extend({
  _copyToDest: function(from, to) {
    this.fs.copy(this.templatePath(from), this.destinationPath(to));
  },
  _makeDestDir: function(dir) {
    var newDir = this.destinationPath(dir);
    if (!this.fs.exists(newDir)) {
      this.mkdir(newDir);
    }
  },
  _copyToDestWithTemplate: function (from, to, template) {
    this.fs.copyTpl(
      this.templatePath(from),
      this.destinationPath(to),
      template);
  },
  prompting: function () {
    var done = this.async();

    var prompts = [{
      name: 'generatorWebappName',
      message: 'What is your webapp\'s name ?',
      default : this.determineAppname(),
      desc: 'Name of your webapp. We will create an app with this name in current directory'
    }];

    this.prompt(prompts, function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },
  deriveAnswers: function() {
    this.answers['generatorWebappNameWithDashes'] = us(
      this.answers['generatorWebappName']).decapitalize().dasherize().value();

  },
  askWebappWebsite: function() {
    var done = this.async();
    var prompts = [ {
      name: 'generatorWebappNameWithDashes',
      message: 'What is your module\'s dasherized name ? Will use this as the main module name:',
      default : this.answers['generatorWebappNameWithDashes'],
      desc: 'Dasherized name of the webapp'
    },, {
      name: 'generatorWebappDescription',
      message: 'What is your webapp\'s description ?',
      default : this.determineAppname(),
      desc: 'Description of your webapp.'
    }, {
      name: 'generatorUserEmail',
      message: 'What is your email ?',
      default : this.user.git.email(),
      desc: 'Your email, goes into package.json'
    }, {
      name: 'generatorUserName',
      message: 'What is your name ?',
      default : this.user.git.name(),
      desc: 'Your name, goes into package.json'
    }, {
      name: 'generatorUserGithubName',
      message: 'What is your github username ?',
      default : this.user.git.email().split('@')[0],
      desc: 'Your github account name, goes into package.json'
    }, {
      name: 'generatorWebappWebsite',
      message: 'What is your webapp\'s own website ?',
      default : 'http://www.' +
        this.answers['generatorWebappNameWithDashes'] +
        '.com',
      desc: 'The website for your module, goes into package.json'
    }];
    this.prompt(prompts, function (answers) {
      var propNames = Object.getOwnPropertyNames(answers);
      for (var i = 0; i < propNames.length; i++) {
        this.answers[propNames[i]] = answers[propNames[i]];
      }
      done();
    }.bind(this));
  },
  fixUsername: function() {
    this.answers['generatorUserName'] = us.titleize(this.answers['generatorUserName']);
  },
  tellUserOurTemplate: function(){
    this.log('We will use the values below for templating:');
    this.log(this.answers);
  },
  scaffoldFolders: function(){
    this._makeDestDir('src');
    this._makeDestDir('assets');
    this._makeDestDir('assets/css');
    this._makeDestDir('assets/js');
  },
  copyFiles: function(){
    this._copyToDest('._editorconfig', '.editorconfig');
    this._copyToDest('._flowconfig', '.flowconfig');
    this._copyToDest('._gitignore', '.gitignore');
    this._copyToDest('._jscsrc', '.jscsrc');
    this._copyToDest('_Gruntfile.js', 'Gruntfile.js');
    this._copyToDestWithTemplate('_LICENCE.md', 'LICENCE.md', this.answers);
    this._copyToDestWithTemplate('_README.md.template', 'README.md.template', this.answers);
    this._copyToDest('_HOW_TO_GUIDE.md', 'HOW_TO_GUIDE.md');
    this._copyToDest('_jsdoc.conf', 'jsdoc.conf');
    this._copyToDestWithTemplate('_package.json', 'package.json', this.answers);
    // Now directories
    this._copyToDest('_assets/_js/*', 'assets/js/');
    this._copyToDest('_assets/_css/*', 'assets/css/');
    this._copyToDest('_src/*', 'src/');
    this._copyToDestWithTemplate('_src/index.html.template', 'src/index.html.template', this.answers);
    
  },
  installingDependencies: function() {
    this.installDependencies({
      bower: false,
      npm: true,
      callback: function () {
        console.log(chalk.yellow('\nEverything is ready!'));
        console.log(chalk.yellow('You can type "grunt", and get your webapp built into dist/.'));
        console.log(chalk.magenta('cd dist/ and type python -m SimpleHTTPServer 8000'));
        console.log(chalk.yellow('Go to http://localhost:8000 and voila, your webapp is running!'));
        console.log(chalk.cyan('\nFor more information, refer to README.md.'));
        console.log(chalk.green('\nEnjoy the ride, and have fun coding!'));
      }
    });
  }
});
