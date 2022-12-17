export class Registration {
    discipline: string;
    category: string;
    member: string[];
}

export function mapper(body: any): Registration {
    return {
        discipline: body.discipline,
        category: body.category,
        member: body.member,
    }
}
