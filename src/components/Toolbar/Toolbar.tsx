import React from "react";
import styled from "styled-components";
import { Tag } from "../../store/useTagStore";
import AddNewTaskModal from "../Modals/Add/AddNewTaskModal";
import AddNewTagModal from "../Modals/Add/AddNewTagModal";
import { COLOR, Spacer, TYPOPGRAPHY } from "../../common/styles";
import TagMenu from "../TagMenu/TagMenu";
import EditTagModal from "../Modals/Edit/EditTagModal";

const ToolbarContainer = styled.div`
    width: 200px;
    min-height: 100vh;
    background: inherit;
    border-right: 0.5px solid rgb(220, 234, 255);
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


const Toolbar: React.FC<{ tagsArr: Tag[] }> = ({ tagsArr }) => {
    const [showEditTagModal, setShowEditTagModal] = React.useState(false);

    return (
        <ToolbarContainer>
            <AddNewTaskModal />
            <Spacer $space={"2rem"} />
            <AddNewTagModal />
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