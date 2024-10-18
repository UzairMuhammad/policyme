import React, { useState, useEffect } from 'react';
import { ATTRIBUTE_LIST } from './consts';
import { CLASS_LIST } from './consts';
import { SKILL_LIST } from './consts';


const CharacterSheet = () => {
    const maximum = 70; 

    const [characters, setCharacters] = useState([{
        id: Date.now(), 
        attributes: {
            Strength: 10,
            Dexterity: 10,
            Constitution: 10,
            Intelligence: 10,
            Wisdom: 10,
            Charisma: 10,
        },
        skillPoints: SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {}),
        selectedClass: null
    }]);
    // Function to add character
    const addCharacter = () => {
        const newCharacter = {
            id: Date.now(), 
            attributes: {
                Strength: 10,
                Dexterity: 10,
                Constitution: 10,
                Intelligence: 10,
                Wisdom: 10,
                Charisma: 10,
            },
            skillPoints: SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {}),
            selectedClass: null
        };
        setCharacters([...characters, newCharacter]);
    };

    // Function to remove character
    const removeCharacter = (id) => {
        setCharacters(characters.filter(character => character.id !== id));
    };

/* API SECTION */

const apiUrl = 'https://recruiting.verylongdomaintotestwith.ca/api/UzairMuhammad/character';

// Function to save Character in API
const saveCharacter = async () => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characters),
        });
        if (response.ok) {
            console.log("characters save");
        }
    } catch (error) {
        console.error('Error in saveCharacter req:', error);
    }
};

  // Function to load character, give default values if it doesn't work. 
  const loadCharacter = async () => {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();
        const characterData = responseData.body;

        if (characterData && Array.isArray(characterData)) {
            setCharacters(characterData); // Load all characters
            console.log('character data loaded');
        } else {
            console.log('Set default character values');
            // Default character creation if no characters found in the API
            setCharacters([{
                id: Date.now(),
                attributes: {
                    Strength: 10,
                    Dexterity: 10,
                    Constitution: 10,
                    Intelligence: 10,
                    Wisdom: 10,
                    Charisma: 10,
                },
                skillPoints: SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {}),
                selectedClass: null
            }]);
        }
    } catch (error) {
        console.error('Error loadCharacter', error);
    }
};
  

  // Load character when app starts
  useEffect(() => {
    loadCharacter();
  }, []);

  /* END OF API SECTION */


// Formula for ability modifier
const calculateModifier = (attributeValue) => {
    return Math.floor((attributeValue - 10) / 2);
    };
  

    /**  SKILLS SECTION (STEP 5) **/
  const [skillPoints, setSkillPoints] = useState(
    SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {})
  );

    // Constants
    const calculateRemainingPoints = (character) => {
        const intelligenceModifier = calculateModifier(character.attributes.Intelligence);
        const totalSkillPoints = 10 + (4 * intelligenceModifier);
        const pointsSpent = Object.values(character.skillPoints).reduce((sum, points) => sum + points, 0);
        const remainingPoints = totalSkillPoints - pointsSpent;
      
        return remainingPoints;
      };
      
  const [selectedClass, setSelectedClass] = useState(null);
  const increaseSkillPoints = (id, skill) => {
    setCharacters((prevCharacters) => 
      prevCharacters.map((char) => {
        if (char.id === id) {
          const remainingPoints = calculateRemainingPoints(char);
          if (remainingPoints > 0) {
            return {
              ...char,
              skillPoints: {
                ...char.skillPoints,
                [skill]: char.skillPoints[skill] + 1,
              },
            };
          }
        }
        return char;
      })
    );
  };

  const decreaseSkillPoints = (id, skill) => {
    setCharacters((prevCharacters) => 
      prevCharacters.map((char) => {
        if (char.id === id && char.skillPoints[skill] > 0) {
          return {
            ...char,
            skillPoints: {
              ...char.skillPoints,
              [skill]: char.skillPoints[skill] - 1,
            },
          };
        }
        return char;
      })
    );
  };
  

  const showSkills = (character) => {
    return SKILL_LIST.map((skill) => {
      const attribute = skill.attributeModifier; 
      const modifier = calculateModifier(character.attributes[attribute]);
      const skillPointsSpent = character.skillPoints[skill.name];
      const totalSkillValue = skillPointsSpent + modifier;
  
      return (
        <li key={skill.name}>
          {skill.name} - Points: {skillPointsSpent} -> Modifier ({attribute}): {modifier >= 0 ? `+${modifier}` : modifier} Total: {totalSkillValue}
          <button onClick={() => increaseSkillPoints(character.id, skill.name)}>+</button>
          <button onClick={() => decreaseSkillPoints(character.id, skill.name)}>-</button>
        </li>
      );
    });
  };
  
  

  /** END OF SKILLS SECTION **/

  
  const validClass = (character, className) => {
    const minimumClassValues = CLASS_LIST[className];
  
    let valid = true; 
    ATTRIBUTE_LIST.forEach((attribute) => {
      if (character.attributes[attribute] < minimumClassValues[attribute]) {
        valid = false;
      }
    });
  
    return valid;
  };
  
  // Method to display attributes
  const showAttributes = (character) => {
    return ATTRIBUTE_LIST.map((attribute) => {
        const attributeValue = character.attributes[attribute];
        const modifier = calculateModifier(attributeValue);
        return (
            <li key={attribute}>
                {attribute}: {attributeValue} -> Modifier: {modifier >= 0 ? `+${modifier}` : modifier}
                <button onClick={() => increaseAttribute(character.id, attribute)}>+</button>
                <button onClick={() => decreaseAttribute(character.id, attribute)}>-</button>
            </li>
        );
    });
    };

  // Method to display classes and if they're valid
  const showClasses = (character) => {
    return Object.keys(CLASS_LIST).map((className) => (
      <li
        key={className}
        onClick={() => selectClass(character.id, className)} 
        style={{
          color: validClass(character, className) ? 'green' : 'red',
          fontWeight: validClass(character, className) ? 'bold' : 'normal',
        }}
      >
        {className}
      </li>
    ));
  };

  // Method to select a class
  const selectClass = (className) => {
    setSelectedClass((prevClass) => (prevClass === className ? null : className));
  };

// Get the total of attributes
const getTotalAttributes = (character) => {
    return Object.values(character.attributes).reduce((total, value) => total + value, 0);
  };
    
  // See if you can increase
  const canIncrease = (character) => {
    return getTotalAttributes(character) < maximum;
  };
  
  // Increase
  const increaseAttribute = (id, attribute) => {
    setCharacters((prevCharacters) => 
      prevCharacters.map((char) => {
        if (char.id === id && canIncrease(char)) {
          return {
            ...char,
            attributes: {
              ...char.attributes,
              [attribute]: char.attributes[attribute] + 1,
            },
          };
        }
        return char;
      })
    );
  };
  
  // Show the class requirements for the selected class
  const displayClassRequirements = (character) => {
    if (!character.selectedClass) {
      return <p>Select a class to see its minimum required statistics</p>;
    }
    const requirements = CLASS_LIST[character.selectedClass];
    return (
      <div>
        <h3>Minimum Requirements for {character.selectedClass}</h3>
        <ul>
          {ATTRIBUTE_LIST.map((attribute) => (
            <li key={attribute}>
              {attribute}: {requirements[attribute]}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Decrease
  const decreaseAttribute = (id, attribute) => {
    setCharacters((prevCharacters) => 
      prevCharacters.map((char) => {
        if (char.id === id) {
          return {
            ...char,
            attributes: {
              ...char.attributes,
              [attribute]: char.attributes[attribute] > 0 ? char.attributes[attribute] - 1 : 0,
            },
          };
        }
        return char;
      })
    );
  };
  
  return (
    <div>
      <button onClick={addCharacter}>Add New Character</button> {/* Button to add a new character */}
      {characters.map((character) => (
        <div key={character.id} className="CharacterSheet">
          <h2>Character Attributes</h2>
          <ul>{showAttributes(character)}</ul> 
  
          <h2>Classes</h2>
          <ul>{showClasses(character)}</ul>
          
          {displayClassRequirements(character)} 
          
          <h2>Available Skill Points: {calculateRemainingPoints(character)}</h2> 
          
          <ul>{showSkills(character)}</ul> 
          
          <button onClick={() => saveCharacter(character)}>Save Character</button> 
          <button onClick={() => removeCharacter(character.id)}>Remove Character</button>
        </div>
      ))}
    </div>
  );
  
  
};
export default CharacterSheet;
