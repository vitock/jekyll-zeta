# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "jekyll-zeta"
  spec.version       = "0.3.5.1"
  spec.authors       = ["vitock"]
  spec.email         = ["r"]

  spec.summary       = "A clean fast, minimalist Jekyll theme."
  spec.homepage      = "https://github.com/vitock/jekyll-zeta"
  spec.license       = "GPL"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README|_config\.yml|index\.html)!i) }
  

  spec.add_runtime_dependency "jekyll", ">= 4.0.0"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.0.0"
  
  spec.add_runtime_dependency "no-style-please2-plugins", "~>0.6.0"

end
