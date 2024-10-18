import React, { useState, useEffect } from 'react';
import { ATTRIBUTE_LIST } from './consts';
import { CLASS_LIST } from './consts';
import { SKILL_LIST } from './consts';


const CharacterSheet = () => {
    const maximum = 70; 
  const [attributes, setAttributes] = useState({
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  });



/* API SECTION */

const apiUrl = 'https://recruiting.verylongdomaintotestwith.ca/api/UzairMuhammad/character';

// Function to save Character in API
const saveCharacter = async () => {
    const characterData = {
      attributes,
      skillPoints,
      selectedClass,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      });
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
  
      if (characterData && Object.keys(characterData).length > 0) {
        setAttributes(characterData.attributes || {});
        setSkillPoints(characterData.skillPoints || {});
        setSelectedClass(characterData.selectedClass || null);
        console.log('character data loaded');
      } else {
        console.log('Set default values');
        setAttributes({
          Strength: 10,
          Dexterity: 10,
          Constitution: 10,
          Intelligence: 10,
          Wisdom: 10,
          Charisma: 10,
        });
        setSkillPoints(SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {}));
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
  const intelligenceModifier =calculateModifier(attributes.Intelligence)
  const totalSkillPoints = 10 + (4 * intelligenceModifier);
  const pointsSpent = Object.values(skillPoints).reduce((sum, points) => sum + points, 0);
  const remainingPoints = totalSkillPoints - pointsSpent;



  const [selectedClass, setSelectedClass] = useState(null);
  const increaseSkillPoints = (skill) => {
    if (remainingPoints > 0) {
      setSkillPoints((prevPoints) => ({
        ...prevPoints,
        [skill]: prevPoints[skill] + 1,
      }));
    }
  };

  const decreaseSkillPoints = (skill) => {
    if (skillPoints[skill] > 0) {
      setSkillPoints((prevPoints) => ({
        ...prevPoints,
        [skill]: prevPoints[skill] - 1,
      }));
    }
  };

  const showSkills = () => {
    return SKILL_LIST.map((skill) => {
      const attribute = skill.attributeModifier; 
      const modifier = calculateModifier(attributes[attribute]);
      const skillPointsSpent = skillPoints[skill.name];
      const totalSkillValue = skillPointsSpent + modifier;
  
      return (
        <li key={skill.name}>
          {skill.name} - Points: {skillPointsSpent} -> Modifier ({attribute}): {modifier >= 0 ? `+${modifier}` : modifier} Total: {totalSkillValue}
          <button onClick={() => increaseSkillPoints(skill.name)}>+</button>
          <button onClick={() => decreaseSkillPoints(skill.name)}>-</button>
        </li>
      );
    });
  };
  

  /** END OF SKILLS SECTION **/

  
  const validClass = (className) => {
    const minimumClassValues = CLASS_LIST[className];

    let valid = true; 
    ATTRIBUTE_LIST.forEach((attribute) => 
    { if (attributes[attribute] < minimumClassValues[attribute]) {
        valid = false;// all must be true
      }
    });
  
    return valid;
  };

  // Method to display attributes
  const showAttributes = () => {
    const attributeElements = [];
  
    for (let i = 0; i < ATTRIBUTE_LIST.length; i++) {
      const attribute = ATTRIBUTE_LIST[i];
      const attributeValue = attributes[attribute];
      const modifier = Math.floor((attributeValue - 10) / 2);
      attributeElements.push(
        <li key={attribute}>
          {attribute}: {attributeValue} -> Modifier: {modifier >= 0 ? `+${modifier}` : modifier}
          <button onClick={() => increaseAttribute(attribute)}>+</button>
          <button onClick={() => decreaseAttribute(attribute)}>-</button>
        </li>
      );
    }
    return attributeElements;
  };

  // Method to display classes and if they're valid
  const showClasses = () => {
    return Object.keys(CLASS_LIST).map((className) => (
      <li
        key={className}
        onClick={() => selectClass(className)} 
        style={{
          color: validClass(className) ? 'green' : 'red',
          fontWeight: validClass(className) ? 'bold' : 'normal',
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
  const getTotalAttributes = () => {
    return Object.values(attributes).reduce((total, value) => total + value, 0);
  };
  
  // See if you can increase
  const canIncrease = () => {
    return getTotalAttributes() < maximum;
  };

  // Increase
  const increaseAttribute = (attribute) => {
        if (canIncrease()) {

        setAttributes((prevAttributes) => ({
        ...prevAttributes,
        [attribute]: prevAttributes[attribute] + 1,
        }));
    }
  };

  // Show the class requirements for the selected class
  const displayClassRequirements = () => {
    if (!selectedClass) {
      return <p>Select a class to see its minimum required statistics</p>;
    }
    const requirements = CLASS_LIST[selectedClass];
    return (
      <div>
        <h3>Minimum Requirements for {selectedClass}</h3>
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
  const decreaseAttribute = (attribute) => {
    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [attribute]: prevAttributes[attribute] > 0 ? prevAttributes[attribute] - 1 : 0,
    }));
  };



  return (
    <div className="CharacterSheet">
      <h2>Character Attributes</h2>
      <ul>{showAttributes()}</ul>
      <h2>Classes</h2>
      <ul>{showClasses()}</ul>
      {displayClassRequirements()} 
      <h2>Available Skill Points: {remainingPoints}</h2>
      <ul>{showSkills()}</ul>
      <button onClick={saveCharacter}>Save Character</button>

    </div>
  );
};
export default CharacterSheet;
