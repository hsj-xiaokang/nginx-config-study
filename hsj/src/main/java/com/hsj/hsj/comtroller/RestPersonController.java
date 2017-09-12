package com.hsj.hsj.comtroller;

import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hsj.hsj.pojo.Person;


@RestController
@RequestMapping("/person")
public class RestPersonController {
	 
	@RequestMapping(value = "/get", method = { RequestMethod.POST, RequestMethod.GET }) 
     public Person restApi(){
    	 return new Person("hsj",25);
     }
	
	/**
	 * 
	 * @Description:double数值比较大小
	 * @author:hsj qq:2356899074
	 * @time:2017年9月12日 上午11:15:45
	 * @return
	 */
	@RequestMapping(value = "/getLd", method = { RequestMethod.POST, RequestMethod.GET }) 
    public Object getLd(){
		       JSONObject jb = new JSONObject();       
		
        		BigDecimal b1 = BigDecimal.valueOf(1.258);
        		
        		BigDecimal b2 = BigDecimal.valueOf(9.17);
        		if(b1.compareTo(b2) == 0){
        			jb.put("1.258 == 9.17", "----9.17-----");
        		}
        		BigDecimal b3 = BigDecimal.valueOf(1.2580);
        		if(b1.compareTo(b3) == 0){
        			jb.put("1.258 == 1.2580", "1.258 == 1.2580");
        		}     
        return  jb;
    }
}




