# arduino source parser

### usage

return all program variables which get updated:

    arduino-parser --ident source.ino

return an instrumented version of code which monitors code values:

    arduino-parser --measure=a,b,c source.ino

show debugging information:

    arduino-parser --debug source.ino
