# @burnsred/default

Provides tools for mapping fallback defaults.

## No Arguments

With no arguments, provides the shared context.
```
import { useDefault } from '@burnsred/default';

    ...

    const Defaults = useDefault()
```
is effectively
```
import { DefaultContext } from '@burnsred/default';

    ...

    const Defaults = React.useContext(DefaultContext);
```

## One Argument: defaultMap

With one argument, will produce an object from the supplied mapping.

If the key exists in the context, that lookup will be used directly.

If not, each of the supplied fallbacks will be tried.

Failing those, the value will be `undefined`.

For example, with a component like:

```
import { useDefault } from '@burnsred/default';

const defaultMap = {
    ActionButton: ['SpecialButton', 'Button',],
};

function DoThingButton(props) {
    const Defaults = useDefaults(defaultMap);

    return (
        <Default.ActionButton>Press Here</Default.ActionButton>
    )
}
```

our App can now *globally* re-configure which component `DoThingButton` will use for its `Button`.

If `ActionButton` is not defined, then `SpecialButton` will be used, and failing that `Button`.

Our App may then, towards the root, provide the overriding defaults:

```
import { DefaultProvider } from '@burnsred/default';

const defaults = {
    Button: Button,
    SpecialButton: SpecialButton,
}

function RootContainer({ children }) {

    return (
        <DefaultProvider {...defaults} >{children}</DefaultProvider>
    );
}
```

So in this case whilst we're not overriding `ActionButton`, we are specifying `SpecialButton`, so `DoThingButton` will use that.

Also, since `Context`s can be localised to parts of the tree, we can redefine these dafults for specific portions of our App.

## Two Arguments: defaultMap, context

Finally, a custom `context` can be provided.

This might be used to provided parallel shared contexts, or altenatively a way to map `props`, again allowing for overrides controlled by the parent.
