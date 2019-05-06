package com.homework.olexii.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "notes")
public class Notice {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String text;

    public Notice() {
    }

    public Notice(long id, String text) {
        this.id = id;
        this.text = text;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notice notice = (Notice) o;
        return id == notice.id &&
                Objects.equals(text, notice.text);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, text);
    }

    @Override
    public String toString() {
        return "Notice{" +
                "id=" + id +
                ", text='" + text + '\'' +
                '}';
    }
}
