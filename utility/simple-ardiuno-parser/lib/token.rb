# Quite hairy way to attach a label to each of the string chunks.

module Keywords
  CKEYS = %w(

  asm auto break case char const continue default do double else enum extern
  float for goto if int inline long register return short signed sizeof static
  struct switch typedef typeof union unsigned void volatile while TRUE FALSE
  DEBUG NULL STDOUT stdout STDERR stderr STDIN stdin printf scanf fprint abort
  putenv puts rand remove rename sinh sqrt srand strcat strcmp strerror time
  LOW HIGH analogRead analogWrite A0 A1 A2 A3 A4 A5 A6 A7 A8 setup loop INPUT
  OUTPUT digitalWrite digitalRead delay delayMicroseconds pinMode

  )
end

class String
  include Keywords
  def is_key? # CHECKING C
    CKEYS.any? { |k| self == k }
  end

  # Get all parts of the string split by a specific pattern
  # Iterative bc recursive version makes the stack overflow.
  def allparts(pat)
    out = []
    tmp = self.partition(pat)
    until tmp.all?(&:empty?)
      out.push(tmp[0])
      out.push(tmp[1])
      break if tmp[2].empty?
      tmp = tmp[2].partition(pat)
    end
    out
  end
end
