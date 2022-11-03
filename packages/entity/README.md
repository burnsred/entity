# @burnsred/entity

An `Entity` defines an object composed of `Field`s.

Each `Field` specifies a type, along with a set of `cleaners` and `validators`.

It provides a factory function `dataToRecord` to create a `Record` based on its defined fields, as well as `toData` to reduce a record to plain JS types.


## Errors

Errors can take many shapes.

### string

An error in some cases is simply a string of the error message.

### Map

In most cases, it is an `Immutable.Map` with the following keys:

detail
: This error is for a specific field

message
: Human readable description of the error

errors
: A single Map, or List of Maps, of nested errors.

list
: This record is for errors over a list of values
