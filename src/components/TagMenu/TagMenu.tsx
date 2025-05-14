import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { EllipsisVertical } from "lucide-react";
import useTagStore from "../../store/useTagStore";
import styled from "styled-components";

const Button = styled.button`
    background: inherit;
    border: none;
    align-item: center;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
        color: #99a1af;
    }
`;
const TagMenuWrapper = styled.div`
    margin: auto;
`;
interface ITagMenu {
    tagId: string;
    setShowTagModal(tag: boolean): void;
}
const TagMenu: React.FC<ITagMenu> = ({ tagId, setShowTagModal }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { deleteDashboardTag, setTagIdToEdit } = useTagStore();
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        setTagIdToEdit(tagId);
        setShowTagModal(true);
        handleClose();
    };
    const handleDelete = () => {
        deleteDashboardTag(tagId);
        handleClose();
    };
    return (
        <TagMenuWrapper>
            <Button
                id="more-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <EllipsisVertical />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                disableScrollLock
            >
                <MenuItem onClick={handleEdit}>
                    <p className="font-inter text-sm">Edit</p>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <p className="font-inter text-sm">Delete</p>
                </MenuItem>
            </Menu>
        </TagMenuWrapper>
    );
}
export default TagMenu;