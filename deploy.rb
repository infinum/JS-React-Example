require 'mina/deploy'
require 'mina/git'
require 'mina/infinum'
require 'mina/secrets'

set :application_name, 'js-react-example'
set :repository, 'git@github.com:infinum/JS-React-Example.git'

task :staging do
	set :domain, 'react-example.byinfinum.co'
	set :deploy_to, '/home/js_react_example/www/react-example.byinfinum.co'
	set :port, '229'
	set :user, 'js_react_example'
	set :branch, 'master'
	set :next_app_env, 'staging'
end

task :build_app do
  command 'npm install'
  command "NEXT_APP_ENV=#{fetch(:next_app_env)} npm run build"
end

task :deploy do
  invoke :'git:ensure_pushed'
  invoke :'ssh_keyscan_domain'

  deploy do
    invoke :'git:clone'

    # command "secrets pull -e #{fetch(:secrets_env)} -y"
    invoke :'build_app'
    invoke :'deploy:cleanup'

    on :launch do
      invoke :restart_application
    end
  end
end
