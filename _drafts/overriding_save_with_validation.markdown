---
layout: post
published: false
---
In order to override save_with_validation you should alias_method_chain :save and call save_without_validation into it

# FIXME: Fix for rails 2.3.4 bug
# https://rails.lighthouseapp.com/projects/8994/tickets/3222-activeresource-is-not-extracting-errors-from-an-xml-response-if-the-content-type-is-applicationxml-charsetutf-8
# Remove when rails is upgraded past 2.3.5
# Also, this should be implemented with such alias_method_chaining because
# otherwise it won't be working, because you cannot override save_with_validation
def save_with_validation_and_content_type
  save_without_validation
  true
rescue ActiveResource::ResourceInvalid => error
  case error.response['Content-Type']
  when /xml/
    errors.from_xml(error.response.body)
  when /json/
    errors.from_json(error.response.body)
  end
  false
end
alias_method_chain :save, :validation_and_content_type
