package com.hsj.hsj.pojo;

/**
 * 
 * @Description:实体
 * @author:hsj qq:2356899074
 * @time:2017年9月11日 下午2:35:44
 */
public class Person {
	private String name;
	private Integer age;

	public Person() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Person(String name, Integer age) {
		super();
		this.name = name;
		this.age = age;
	}

	public String getName() {
		return name;
	}

	public Integer getAge() {
		return age;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

}
