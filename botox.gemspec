$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "botox/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "botox"
  s.version     = Botox::VERSION
  s.authors     = ["Bastiaan Terhorst"]
  s.email       = ["bastiaan@perceptor.nl"]
  s.homepage    = "http://perceptor.nl"
  s.summary     = "Remove the wrinkles from your user experience using Rails, Ajax and the History API"
  s.description = ""

  s.files        = `git ls-files`.split("\n")
  s.executables  = `git ls-files`.split("\n").select{|f| f =~ /^bin/}
  s.require_path = 'lib'
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.6"

end
