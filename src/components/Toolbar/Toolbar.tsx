import React from "react";
import styled from "styled-components";
import { Tag } from "../../store/useTagStore";
import AddNewTaskModal from "../Modals/Add/AddNewTaskModal";
import AddNewTagModal from "../Modals/Add/AddNewTagModal";
import { Spacer, TYPOPGRAPHY } from "../../common/styles";
import TagMenu from "../TagMenu/TagMenu";
import EditTagModal from "../Modals/Edit/EditTagModal";

const ToolbarContainer = styled.div`
    width: 200px;
    min-height: 100vh;
    background: inherit;
    border-right: ${({ theme }) => `0.5px solid ${theme.COLORS.BORDER_COLOR_LIGHT}`};
    min-width: 150px;
    padding-top: 2rem;
`;
const TagGroup = styled.div`
    padding-inline: 0.5rem;
`;
const TagDisplay = styled.div`
    padding: 0.5rem;
    text-align: left;
    margin-block: 0.5rem;
    border-radius: 4px;
    display: flex;
`
const TagTitle = styled.h3`
    text-overflow: ellipsis;
    overflow: hidden;
    justify-content: end;
    flex: 1;
    font-family: ${TYPOPGRAPHY.OSWALD};
    font-weight: 400;
    margin: 0;
`;
const SubTitle = styled.h2`
    font-family: ${TYPOPGRAPHY.OSWALD};
    color:  ${({ theme }) => theme.COLORS.TEXT_COLOR};
    font-size: 1.2rem;
    letter-spacing: 0.025rem;
    display: inline;
    vertical-align: middle;
    padding-left: 0.5rem;
`;

const Toolbar: React.FC<{ tagsArr: Tag[] }> = ({ tagsArr }) => {
    const [showEditTagModal, setShowEditTagModal] = React.useState(false);

    return (
        <ToolbarContainer>
            <AddNewTaskModal />
            <Spacer $space={"2rem"} />
            <SubTitle>Tags</SubTitle>
            {tagsArr.length < 10 && <AddNewTagModal />}
            <EditTagModal showModal={showEditTagModal} setShowModal={setShowEditTagModal} />

            <TagGroup>
                <div>
                    {tagsArr?.map((t: Tag, k: number) => {
                        return (
                            <TagDisplay key={k} style={{ background: t.color }}>
                                <TagTitle>
                                    {t.name}
                                </TagTitle>
                                <TagMenu tagId={t.id} setShowTagModal={setShowEditTagModal} />
                            </TagDisplay>
                        )
                    })}
                </div>
            </TagGroup>
        </ToolbarContainer>
    )
}
export default Toolbar;