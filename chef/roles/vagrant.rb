name "vagrant"
description "Vagrant with sbirez and its dependencies"

run_list "recipe[apt]", "recipe[build-essential::default]", "nginx", "afsbirez::db", "afsbirez"

default_attributes( 
  postgresql: { version: '9.3' },
  nodejs: {npm: '1.4.23' }
)

override_attributes(
  sbirez: {
    nginx_conf_dir: "/etc/nginx/sites-enabled",
    nginx_default: "default",
    nginx_conf_source: "tools/nginx/sites-enabled.default"
  }
)


