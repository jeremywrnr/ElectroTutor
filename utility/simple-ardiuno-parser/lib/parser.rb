# parse and label code, stored in an array

class Line
  attr_reader :line
  attr_accessor :dep, :str
  def initialize(str, line, dep=0)
    @str = str
    @line = line + 1 # 1-indexed source
    @dep = dep
  end

  def to_s
    "\t" * @dep + @str
  end
end

module ParserHelper
  NEWLINE = /\n/
  NEWONLY = /^\n$/
  COMMENT = /\/\/.*/
  ASSIGN = /([\w\.]+)\s*=\s*\w+.*/
  SERIAL = /.*Serial\.begin.*/
  SETUP = /setup.*\(\s*\)\s*{/
  SINS = /\)\s*\n\s*{/m
  SPACE = /^\s*$/
  BLKIN = /{/
  BLKOUT = /}/

  def parseCode
    @idents = Set[]
    @code.allparts(NEWLINE).map do |line|
      clean_comment line
    end.map do |line|
      line.strip
    end.reject do |line|
      line.empty?
    end.map do |line|
      check_assign line
    end
  end

  def watchCode
    @depth = 0
    code = check_func @code
    code.allparts(NEWLINE).map do |line|
      clean_comment line
    end.map do |line|
      clean_serial line
    end.inject([]) do |all, line|
      clean_ending all, line
    end.map do |line|
      line.strip
    end.each_with_index.map do |line, i|
      check_block Line.new(line, i)
    end.reject do |line|
      line.str.empty?
    end.map do |b|
      check_setup b
    end.flatten.map do |b|
      check_watcher b
    end.flatten.map do |b|
      merge_watcher b
    end
  end

  private

  def clean_comment(str)
    str.sub(COMMENT, '')
  end

  def clean_serial(str)
    str.sub(SERIAL, '')
  end

  def clean_ending(all, l)
    last = all.last || ""
    # for source map: ignore post-line spaces
    if !last.match(NEWONLY) && l.match(NEWLINE)
      nil
    else
      all.push l
    end
    all
  end

  def check_assign(str)
    if m = str.match(ASSIGN)
      @idents.add m.captures.first
    end
  end

  def check_func(str)
    str.gsub(SINS, ") {\n")
  end

  #
  # Instrumentation
  #

  def check_block(b)
    b.dep = @depth
    if b.str.match(BLKIN) && b.str.match(BLKOUT)
      nil # todo - handle more complex lines
    elsif b.str.match(BLKIN)
      @depth += 1
    elsif b.str.match(BLKOUT)
      @depth -= 1
    end
    b
  end

  def check_setup(b)
    if b.str.match(SETUP)
      beg = Line.new("Serial.begin(115200);", b.line)
      beg.dep = 1
      [b, beg]
    else
      b
    end
  end

  def check_watcher(b)
    if m = b.str.match(ASSIGN)
      val = m.captures[0]
      idx = @watching.find_index(val)
      if idx && b.dep >= 1
        idx_line = b.clone
        val_line = b.clone
        end_line = b.clone
        idx_line.str = serial("\"^#{idx}:#{b.line}:\"", "id, line#")
        val_line.str = serial(val, "var-data")
        end_line.str = serial('"$"', "closure", "ln")
        return [b, idx_line, val_line, end_line]
      end
    end
    b
  end

  def serial(msg, com, ln='')
    "Serial.print#{ln}(#{msg});\t\t// Add: #{com}"
  end

  def merge_watcher(b)
    b.to_s
  end
end
