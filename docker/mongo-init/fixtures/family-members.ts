import { EGender, EGroupRole } from '@/interfaces/index.js';
import { IMemberTemplate } from './types.js';

export const FAMILY_MEMBERS: Record<string, IMemberTemplate> = {
    WORKING_PARENT: {
        role: EGroupRole.ADMIN,
        gender: EGender.MALE,
        age: 35
    },
    STAY_AT_HOME_PARENT: {
        role: EGroupRole.ADMIN,
        gender: EGender.FEMALE,
        age: 32
    },
    TEENAGER: {
        role: EGroupRole.MEMBER,
        gender: EGender.FEMALE,
        age: 15
    },
    CHILD: {
        role: EGroupRole.MEMBER,
        gender: EGender.MALE,
        age: 8
    },
    GRANDPARENT: {
        role: EGroupRole.MEMBER,
        gender: EGender.FEMALE,
        age: 65
    }
};
