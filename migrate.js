var postgrator = require('postgrator');

postgrator.config.set({
    migrationDirectory: __dirname + '/migrations',  // path to the migrations
    driver: 'pg',                                   // or 'mysql' or 'tedious' or 'mssql' (last 2 both non-native SQL Server drivers)
    host: '127.0.0.1',
    database: 'afsbirez_dev',
    username: 'catherinedevlin',
    password: ''
});

var target_db_version = process.argv[2];
if (!target_db_version) {
  target_db_version = 1000000;
}

postgrator.migrate(target_db_version, function (err, migrations) {
    if (err) console.log(err)
    else console.log(migrations)
});
