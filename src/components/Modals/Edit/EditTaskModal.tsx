import React, { useState } from "react";
import { ErrorText, Form, FormItem, Input, Label, ModalTitle, TextArea } from "../Modal.styles";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import { TagSelector } from "../../TagSelector/TagSelector";
import useTaskStore, { Task } from "../../../store/useTaskStore";
import { isValidLength } from "../../../common/helpers";
import useTagStore from "../../../store/useTagStore";
import { Spacer } from "../../../common/styles";
import { Settings2 } from "lucide-react";
import { DraggableButton } from "../../Draggable/Draggable";
import { Tooltip } from "@mui/material";

const EditTaskModal: React.FC<{ task: Task }> = ({ task }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(task.title);
    const [description, setDescription] = useState<string | undefined>(task.text);
    const [selectedTags, setSelectedTags] = useState(task.tags || []);
    const [titleError, setTitleError] = useState<string>("");
    const [descriptionError, setDescriptionError] = useState<string>("");

    const { updateTask } = useTaskStore();
    const { currentTags } = useTagStore();

    const handleOpen = () => {
        setTitle(task.title);
        setTitleError("");
        setDescription(task.text);
        setDescriptionError("");
        setSelectedTags(task.tags || []);
        setOpen(true);

    }
    const handleClose = () => {
        setTitle(task.title);
        setTitleError("");
        setDescription(task.text);
        setDescriptionError("");
        setSelectedTags(task.tags || []);
        setOpen(false);
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!title.trim()) {
            setTitleError("Name is required.");
            return;
        }
        if (!isValidLength(title, 30)) {
            setTitleError("Name cannot exceed 30 character limit.");
            return;
        }
        if (!isValidLength(description, 500)) {
            setDescriptionError("Description cannot exceed 500 character limit.");
            return;
        }
        await updateTask(task.id, {
            title,
            text: description,
            tags: selectedTags,
        });
        handleClose();
    }
    return (
        <>
            <Tooltip title={"Edit"} placement="top">
                <DraggableButton
                    onClick={handleOpen}
                >
                    <Settings2 />
                </DraggableButton>
            </Tooltip>
            <ModalWrapper setIsOpen={setOpen} isOpen={open}>
                <ModalTitle>Edit task</ModalTitle>
                <Form onSubmit={handleSubmit}>
                    <FormItem>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {titleError && <ErrorText>{titleError}</ErrorText>}
                    </FormItem>
                    <FormItem>
                        <Label>Description</Label>
                        <TextArea
                            name="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {descriptionError && <ErrorText>{descriptionError}</ErrorText>}
                    </FormItem>
                    {/* <FormItem>
                        <Label>Status</Label>
                        <FormDropdown
                            value={activeColumn}
                            onChange={(e) => setActiveColumn(e.target.value)}
                            className="p-2 border rounded-xl w-full bg-slate-100 mt-2 text-black cursor-pointer"
                        >
                            <Option value="todo">To Do</Option>
                            <Option value="progress">In Progress</Option>
                            <Option value="done">Done</Option>
                        </FormDropdown>

                    </FormItem> */}
                    <Label>Tags</Label>
                    <TagSelector
                        availableTags={currentTags}
                        selectedTags={selectedTags}
                        onChange={setSelectedTags}
                    />
                    <Spacer $space={"2rem"} />
                    <ModalButtonGroup
                        leftLabel={"Close"}
                        rightLabel={"Update"}
                        closeModalFunc={handleClose}
                    />
                </Form>
            </ModalWrapper>
        </>
    )
}
export default EditTaskModal;