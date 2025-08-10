import mongoose from 'mongoose';
import { GroupRepository } from '../group.repository';
import {
    EGender,
    EGroupRole,
    EDietaryRestrictionType,
    EDietaryRestriction,
    EActivityLevel,
    IMemberProfile,
    IDietaryRestriction
} from '../../interfaces';

describe('GroupRepository', () => {
    let repository: GroupRepository;

    beforeAll(async () => {
        const dbName = `family-serve-test-repo-${process.env.JEST_WORKER_ID || '0'}`;
        await mongoose.connect(`mongodb://test_user:test_password@localhost:27017/${dbName}?authSource=admin`);
        repository = new GroupRepository();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    describe('CRUD operations', () => {
        it('should create a group with a member and update member profile', async () => {
            // Create initial group
            const group = await repository.create({ name: 'Test Family' });
            expect(group).not.toBeNull();
            expect(group!.id).toBeDefined();
            expect(group!.name).toBe('Test Family');
            expect(group!.members).toHaveLength(0);

            // Add member
            const memberData: Omit<IMemberProfile, 'id'> = {
                firstName: 'John',
                lastName: 'Doe',
                age: 35,
                gender: EGender.MALE,
                role: EGroupRole.ADMIN,
                activityLevel: EActivityLevel.MODERATELY_ACTIVE,
                dietaryProfile: {
                    preferences: {
                        likes: ['Pizza', 'Salad'],
                        dislikes: ['Mushrooms']
                    },
                    allergies: ['Peanuts'],
                    restrictions: [{
                        type: EDietaryRestrictionType.FORBIDDEN,
                        reason: EDietaryRestriction.GLUTEN_FREE,
                        notes: 'Celiac disease'
                    }],
                    healthNotes: 'Needs high-protein meals'
                }
            };

            const updatedGroup = await repository.addMember(group.id!, memberData);
            expect(updatedGroup).not.toBeNull();
            expect(updatedGroup?.members).toHaveLength(1);
            expect(updatedGroup?.members[0].firstName).toBe('John');

            // Test member update with nested fields
            const memberId = updatedGroup!.members[0].id;
            expect(memberId).toBeDefined();

            // Mise à jour partielle du profil
            const updateData: Partial<IMemberProfile> = {
                activityLevel: EActivityLevel.VERY_ACTIVE,
                dietaryProfile: {
                    preferences: {
                        likes: ['Quinoa', 'Salmon', 'Avocado'],
                        dislikes: ['Mushrooms'] // Conserver la valeur existante
                    },
                    allergies: ['Peanuts'], // Conserver la valeur existante
                    restrictions: [{
                        type: EDietaryRestrictionType.FORBIDDEN,
                        reason: EDietaryRestriction.GLUTEN_FREE,
                        notes: 'Celiac disease'
                    }], // Conserver la restriction existante
                    healthNotes: 'Updated health notes'
                }
            };

            const afterUpdate = await repository.updateMember(group.id!, memberId, updateData);

            // Vérification des mises à jour
            expect(afterUpdate).not.toBeNull();
            expect(afterUpdate?.members[0].activityLevel).toBe(EActivityLevel.VERY_ACTIVE);
            expect(afterUpdate?.members[0].dietaryProfile.preferences.likes).toEqual(['Quinoa', 'Salmon', 'Avocado']);
            expect(afterUpdate?.members[0].dietaryProfile.healthNotes).toBe('Updated health notes');

            // Vérification que les autres champs sont préservés
            expect(afterUpdate?.members[0].dietaryProfile.preferences.dislikes).toEqual(['Mushrooms']);
            expect(afterUpdate?.members[0].dietaryProfile.allergies).toEqual(['Peanuts']);
            expect(afterUpdate?.members[0].dietaryProfile.restrictions).toHaveLength(1);
            expect(afterUpdate?.members[0].dietaryProfile.restrictions[0].reason).toBe(EDietaryRestriction.GLUTEN_FREE);
        });

        it('should handle dietary restrictions operations', async () => {
            // Créer un groupe avec un membre
            const group = await repository.create({ name: 'Test Family' });
            const memberData: Omit<IMemberProfile, 'id'> = {
                firstName: 'Jane',
                lastName: 'Doe',
                age: 28,
                gender: EGender.FEMALE,
                role: EGroupRole.MEMBER,
                dietaryProfile: {
                    preferences: {
                        likes: [],
                        dislikes: []
                    },
                    allergies: [],
                    restrictions: []
                }
            };

            const groupWithMember = await repository.addMember(group.id!, memberData);
            expect(groupWithMember).not.toBeNull();
            const memberId = groupWithMember!.members[0].id;

            // Ajouter une restriction
            const restriction: IDietaryRestriction = {
                type: EDietaryRestrictionType.FORBIDDEN,
                reason: EDietaryRestriction.DAIRY_FREE,
                notes: 'Lactose intolerant'
            };

            const afterAddRestriction = await repository.addMemberRestriction(
                group.id!,
                memberId,
                restriction
            );

            expect(afterAddRestriction).not.toBeNull();
            expect(afterAddRestriction?.members[0].dietaryProfile.restrictions).toBeDefined();
            expect(afterAddRestriction?.members[0].dietaryProfile.restrictions).toHaveLength(1);
            expect(afterAddRestriction?.members[0].dietaryProfile.restrictions[0].reason)
                .toBe(EDietaryRestriction.DAIRY_FREE);

            // Mettre à jour toutes les restrictions
            const newRestrictions: IDietaryRestriction[] = [
                {
                    type: EDietaryRestrictionType.FORBIDDEN,
                    reason: EDietaryRestriction.GLUTEN_FREE,
                    notes: 'Celiac disease'
                },
                {
                    type: EDietaryRestrictionType.REDUCED,
                    reason: EDietaryRestriction.DAIRY_FREE,
                    notes: 'Mild lactose intolerance'
                }
            ];

            const afterUpdateRestrictions = await repository.updateMemberRestrictions(
                group.id!,
                memberId,
                newRestrictions
            );

            expect(afterUpdateRestrictions).not.toBeNull();
            expect(afterUpdateRestrictions?.members[0].dietaryProfile.restrictions).toBeDefined();
            expect(afterUpdateRestrictions?.members[0].dietaryProfile.restrictions).toHaveLength(2);

            // Vérifier le contenu des restrictions
            const restrictions = afterUpdateRestrictions?.members[0].dietaryProfile.restrictions;
            expect(restrictions?.find(r => r.reason === EDietaryRestriction.GLUTEN_FREE)).toBeDefined();
            expect(restrictions?.find(r => r.reason === EDietaryRestriction.DAIRY_FREE)).toBeDefined();
        });

        it('should handle dietary allergies operations', async () => {
            // Créer un groupe avec un membre
            const group = await repository.create({ name: 'Test Family' });
            const memberData: Omit<IMemberProfile, 'id'> = {
                firstName: 'Alice',
                lastName: 'Smith',
                age: 25,
                gender: EGender.FEMALE,
                role: EGroupRole.MEMBER,
                dietaryProfile: {
                    preferences: {
                        likes: [],
                        dislikes: []
                    },
                    allergies: [],
                    restrictions: []
                }
            };

            const groupWithMember = await repository.addMember(group.id!, memberData);
            expect(groupWithMember).not.toBeNull();
            const memberId = groupWithMember!.members[0].id;

            // Ajouter une allergie
            const afterAddAllergy = await repository.addMemberAllergy(
                group.id!,
                memberId,
                'Shellfish'
            );

            expect(afterAddAllergy).not.toBeNull();
            expect(afterAddAllergy?.members[0].dietaryProfile.allergies).toBeDefined();
            expect(afterAddAllergy?.members[0].dietaryProfile.allergies).toHaveLength(1);
            expect(afterAddAllergy?.members[0].dietaryProfile.allergies[0]).toBe('Shellfish');

            // Mettre à jour toutes les allergies
            const newAllergies = ['Shellfish', 'Tree nuts', 'Soy'];

            const afterUpdateAllergies = await repository.updateMemberAllergies(
                group.id!,
                memberId,
                newAllergies
            );

            expect(afterUpdateAllergies).not.toBeNull();
            expect(afterUpdateAllergies?.members[0].dietaryProfile.allergies).toBeDefined();
            expect(afterUpdateAllergies?.members[0].dietaryProfile.allergies).toHaveLength(3);
            expect(afterUpdateAllergies?.members[0].dietaryProfile.allergies).toContain('Shellfish');
            expect(afterUpdateAllergies?.members[0].dietaryProfile.allergies).toContain('Tree nuts');
            expect(afterUpdateAllergies?.members[0].dietaryProfile.allergies).toContain('Soy');

            // Retirer une allergie
            const afterRemoveAllergy = await repository.removeMemberAllergy(
                group.id!,
                memberId,
                'Soy'
            );

            expect(afterRemoveAllergy).not.toBeNull();
            expect(afterRemoveAllergy?.members[0].dietaryProfile.allergies).toBeDefined();
            expect(afterRemoveAllergy?.members[0].dietaryProfile.allergies).toHaveLength(2);
            expect(afterRemoveAllergy?.members[0].dietaryProfile.allergies).toContain('Shellfish');
            expect(afterRemoveAllergy?.members[0].dietaryProfile.allergies).toContain('Tree nuts');
            expect(afterRemoveAllergy?.members[0].dietaryProfile.allergies).not.toContain('Soy');
        });
    });
});
