# @burnsred/entity

An `Entity` defines an object composed of `Field`s.

Each `Field` specifies a type, along with a set of `cleaners` and `validators`.

It provides a factory function `dataToRecord` to create a `Record` based on its defined fields, as well as `toData` to reduce a record to plain JS types.
