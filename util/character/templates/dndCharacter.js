import CharacterSheet from "@/util/character/CharacterSheet";

export default function createDndCharacter(abilityScores, skills, level){
    let outputAbilityScores = {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        }
    let outputSkills =  {
        athletics: {
            displayName: 'athletics',
            abilityScore: 'strength',
            proficiency: false,
            expertise: false,
        },
        acrobatics: {
            displayName: 'acrobatics',
            abilityScore: 'dexterity',
            proficiency: false,
            expertise: false,
        },
        sleightOfHand: {
            displayName: 'sleight of Hand',
            abilityScore: 'dexterity',
            proficiency: false,
            expertise: false,
        },
        stealth: {
            displayName: 'stealth',
            abilityScore: 'dexterity',
            proficiency: false,
            expertise: false,
        },
        arcana: {
            displayName: 'arcana',
            abilityScore: 'intelligence',
            proficiency: false,
            expertise: false,
        },
        history: {
            displayName: 'history',
            abilityScore: 'intelligence',
            proficiency: false,
            expertise: false,
        },
        investigation: {
            displayName: 'investigation',
            abilityScore: 'intelligence',
            proficiency: false,
            expertise: false,
        },
        nature: {
            displayName: 'nature',
            abilityScore: 'intelligence',
            proficiency: false,
            expertise: false,
        },
        religion: {
            displayName: 'religion',
            abilityScore: 'intelligence',
            proficiency: false,
            expertise: false,
        },
        animalHandling: {
            displayName: 'animal Handling',
            abilityScore: 'wisdom',
            proficiency: false,
            expertise: false,
        },
        insight: {
            displayName: 'insight',
            abilityScore: 'wisdom',
            proficiency: false,
            expertise: false,
        },
        medicine: {
            displayName: 'medicine',
            abilityScore: 'wisdom',
            proficiency: false,
            expertise: false,
        },
        perception: {
            displayName: 'perception',
            abilityScore: 'wisdom',
            proficiency: false,
            expertise: false,
        },
        survival: {
            displayName: 'survival',
            abilityScore: 'wisdom',
            proficiency: false,
            expertise: false,
        },
        deception: {
            displayName: 'deception',
            abilityScore: 'charisma',
            proficiency: false,
            expertise: false,
        },
        intimidation: {
            displayName: 'intimidation',
            abilityScore: 'charisma',
            proficiency: false,
            expertise: false,
        },
        performance: {
            displayName: 'performance',
            abilityScore: 'charisma',
            proficiency: false,
            expertise: false,
        },
        persuasion: {
            displayName: 'persuasion',
            abilityScore: 'charisma',
            proficiency: false,
            expertise: false,
        },
    }
    let outputLevel = level || 1;
    let outputProficiencyBonus = 1 + Math.ceil(outputLevel / 4);
    if(abilityScores){
        Object.entries(abilityScores).forEach(([key, value]) =>{
            outputAbilityScores[key] = value
        });
    }
    if(skills){
        Object.entries(skills).forEach(([skillName, skill]) =>{
            Object.entries(skill).forEach(([skillKey, skillValue]) =>{
                outputSkills[skillName][skillKey] = skillValue
            })
        });
    }
    return new CharacterSheet(outputAbilityScores, outputSkills, outputLevel, outputProficiencyBonus)
}