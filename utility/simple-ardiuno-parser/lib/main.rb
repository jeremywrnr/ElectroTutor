require 'pp'
require 'set'
require 'json'

require_relative 'token'
require_relative 'parser'

class ArduinoParser
  include ParserHelper
  def initialize(argv, opts)
    ino = argv[0]
    code = File.read(ino)
    banner = "\n//" + '-' * 77, "\n"
    @code = code
    parseCode
    if opts[:debug]
      puts code.split(NEWLINE).each_with_index.map {|l, i| "#{i+1}\t#{l}"}
      puts banner
      pp @idents.to_a
      puts banner
      puts watchCode @idents
    elsif opts[:ident]
      pp @idents.to_a
    elsif opts[:watch]
      @watching = opts[:watch]
      puts watchCode
    end
  end
end
