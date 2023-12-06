export type OptionalsRemoved<Type> = {
    [Property in keyof Type]-?: Type[Property]
}
