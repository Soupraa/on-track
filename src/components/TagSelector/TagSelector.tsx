import React from "react";
import styled from "styled-components";
import { Tag } from "../../store/useTagStore";
import { TYPOPGRAPHY } from "../../common/styles";

interface TagSelectorProps {
    availableTags: Tag[];
    selectedTags: Tag[];
    onChange: (tags: Tag[]) => void;
}

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
    margin-top: 0.5rem;
`;

const TagLabel = styled.label<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const NoTagsMessage = styled.p`
  font-size: 0.875rem;
  font-family: ${TYPOPGRAPHY.INTER};
  color: #4b5563; 
`;

export const TagSelector: React.FC<TagSelectorProps> = ({
    availableTags,
    selectedTags,
    onChange,
}) => {
    const toggleTag = (tag: Tag) => {
        const isSelected = selectedTags.some((t) => t.id === tag.id);
        if (isSelected) {
            onChange(selectedTags.filter((t) => t.id !== tag.id));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    return (
        <TagWrapper>
            {availableTags.length < 1 && (
                <NoTagsMessage>No tags available.</NoTagsMessage>
            )}
            {availableTags.map((tag) => {
                const isChecked = selectedTags.some((t) => t.id === tag.id);
                return (
                    <TagLabel key={tag.id} $color={tag.color}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTag(tag)}
                            style={{ cursor: "pointer" }}
                        />
                        {tag.name}
                    </TagLabel>
                );
            })}
        </TagWrapper>
    );
};
