import React, { useState } from "react";
import styles from "./StepAvatar.module.css";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import {setAuth} from "../../../store/authSlice";
import { activate } from "../../../http";

const StepAvatar = ({ onNext }) => {
  const dispatch = useDispatch();
  const { name,avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("./images/monkey-avatar.png");
  const captureImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  };
  const submit = async () => {
    try {
      const {data} = await activate({name,avatar});
      if (data.auth){
        dispatch(setAuth(data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Card title={`Okay, ${name}`} icon="monkey-emoji">
        <p className={styles.subHeading}>How’s this photo?</p>
        <div className={styles.avatarWrapper}>
          <img src={image} className={styles.avatarImage} alt="avatar" />
        </div>
        <div>
          <input
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
            onChange={captureImage}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">
            Choose a different photo
          </label>
        </div>
        <div>
          <Button onClick={submit} text="Next" />
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
