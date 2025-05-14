import React from "react";
import styled from "styled-components";
import { Tag } from "../../store/useTagStore";
import AddNewTaskModal from "../Modals/Add/AddNewTaskModal";
import AddNewTagModal from "../Modals/Add/AddNewTagModal";
import { TYPOPGRAPHY } from "../../common/styles";
import TagMenu from "../TagMenu/TagMenu";
import EditTagModal from "../Modals/Edit/EditTagModal";

const ToolbarContainer = styled.div`
    width: 150px;
    height: 100vh;
    padding: 1rem;
    background: #inherit;
    border-right: 2px solid #272727;
    min-width: 100px;
    padding-top: 2rem;
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
            <AddNewTagModal />
            <EditTagModal showModal={showEditTagModal} setShowModal={setShowEditTagModal}/>
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
        </ToolbarContainer>
    )
}
export default Toolbar;