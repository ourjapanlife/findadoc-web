import type { GraphQLResolveInfo } from 'graphql/type/definition'
import type { Resolver } from '~/typedefs/client/graphql'

export const deepFreeze = <Type extends object>(object: Type) => {
    const propNames = Reflect.ownKeys(object)

    for (const name of propNames) {
        const value = Reflect.get(object, name)
        const isObjectOrFunction = value && typeof value === 'object' && !Object.isFrozen(value)
        if (isObjectOrFunction) deepFreeze(value)
    }

    return Object.freeze(object)
}

export const useStateManager = <Type extends object>(initialValue: Type) => {
    let currentValue: Type = initialValue

    return {
        get getValue() {
            return deepFreeze(currentValue)
        },
        set value(value: Type) {
            currentValue = value
        }
    }
}

export const resolverHandler = async <TResult, TArgs>(
    resolver: Resolver<TResult, object, object, TArgs> | undefined,
    variables: TArgs) => {
    const extractResult = async (resolved: TResult | Promise<TResult>) => {
        const result = await Promise.resolve(resolved)
        if (result === null) return null
        if (result instanceof Array) return result
    }

    let resolved: TResult | Promise<TResult>

    switch (typeof resolver) {
        case 'function': {
            resolved = resolver({}, variables, {}, {} as GraphQLResolveInfo)
            break
        }
        case 'object': {
            resolved = resolver.resolve({}, variables, {}, {} as GraphQLResolveInfo)
            break
        }
        default: {
            return resolver
        }
    }

    return await extractResult(resolved)
}
