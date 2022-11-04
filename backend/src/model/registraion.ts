export class Registration {
    discipline: number;
    category: number;
    member: number[];
}

export function mapper(body: any): Registration {
    return {
        discipline: body.discipline,
        category: body.category,
        member: body.member,
    }
}
