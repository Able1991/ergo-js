
require 'find'
require 'pathname'
require 'fileutils'



Dir.foreach(Dir.getwd) do |iconset|
  if iconset != '.' and iconset != '..' and File.directory?(iconset) then
    
    icons_pn = Pathname.new File.join(iconset, 'icons')
    
    filenames = []
    
    Find.find(icons_pn.realpath) do |path|
      pn = Pathname.new path
      filenames << {:name => pn.basename('.*').to_s.gsub('_', '-'), :file => icons_pn.join(pn.basename)}
    end
      
      filenames.sort! {|a, b| a[:name] <=> b[:name] }
    
    File.open(File.join(iconset, 'icons.css'), 'w') do |f|
      f.puts ".e-icon {background-position: 50% 50%; background-repeat: no-repeat;}"
      f.puts
      filenames.each {|s| f.puts ".e-icon-#{s[:name]} {background: url(#{s[:file]})}"}
    end
    
  end
end
