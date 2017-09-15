
export const temperatureIcon = ({ heat_incl, water_incl }) => {
  if (heat_incl && water_incl) {
    return {
      icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAE2klEQVR4Xu2dj5ENQRCH+yJABIgAESACRIAIEAEiQATuInAiQASIABEgAuqr2y1bc/u8nX073b+hp+rqqu5mZ2f7m/43u9t7ZP21i2Z2x8xumdkVM7tuZvyN9sPMPpnZVzN7b2Zvh791c5VH3cz0TPhPzexB5ZyPzez5AKnyUP/uvQB5ZGbPJppQKyk0h+Nf1R7o3b8HII/N7MVGgnloZmiMbFMHctfM3sxI7/MgWPwFP2gADV+CT+EH03Zt5th7ZnaqSkQZCML9ODjuUX4/B0EvFShA0YgLEwA4/Buqzl4ZCCv89USQwCCyQiNqGtpCxDWFImu6lIGgBYS3YztZEWGNx6Il9ydjEQ6jPXJNGQjmitU9ttvDSl8jRDTr3eRAtAyzJdeUgfwqpHXoXLcerwnMQy+yyaSGQbcW4NbjNbn2BNJErOsHTSDrZdfkyATSRKzrB00g62XX5MgE0kSs6wdNIOtl1+TIBNJErOsH7QnI+qusO5LNR/a62P9ybwlkXuRAuepOw8wSyLzUvxXb/m5sEsh5UQODrf80WYVsyr2nrVep5GKUnNSOzcUEsrUEKsdLDakUWOvuCaS1hCvHbw1k13QyD9khmSggTCfzkBkokUAyDxECknlIkMmSDPklJ5V5SGX449S9tQ+RXIySk0oNcVryladprSGZh3QCJPOQoCjrb+sj85DMQ84kkE690o627p5AWku4cvwEUimw1t0TSGsJV47/PwPJPKRysUQlhpmHZB7yRwJpss6vhrwfEqQhkotRclK521vpbZ26t3bqkotRclKpIU5LvvI0rTUk85BOgGQeEhRl5f2QTjQk85AgDZEMaCQnZWYUvXxZqVG13anlKFcUUw0IpWCpIkd9K4/Ga2u8ccvD1RJNCQgQKHg5FkX2EhAFNCmMGfJOYXmRKkDK+opeMKbnkajDqABEAcYIJhxKNJBddXkjNGQ85yG1HQ+edyQQHDiFLr19xj6h4VMokBni6COBlFVH9wnK8/84eDTFvUUBoTA+XzpQbnxRgXm6tgggmKgvgqaqFDymiwI0Y115FzARQHrQjlH47lriDaQX7RiBuGuJNxClnGOpCXLNTbyBKEdWuwC5RlyeQMg7cOY9Npy7S17iCUQxK1+6ONy+yuMJpKfoqgTlFm15AsEW31y6JMX6ffC6R5NAlpH/J4FEPWe1TOT7e7ksXpeTDNeaQPZDd30LN4EkkAUSWN7FxZq4nGS4ZhKry8uvX6qnW2UHTyAZ9i5YY55AMjEUA5JbJ2JAuBfyfcGcFLtc8rpz6GmyEDSfPJ37pLYihHFOfCp8+gnYpnP1BpI3qPbg9AaC2SL8nX5Ku+mKO3BwPhnOfRy3Bx28gSCfnqItt233ceFEAGHF4UvUtcRdO4ASAaQXLXni8NLQOYsaBUQ94nKNrKZUIoGomi5MFWGuy0MNpYpEAmEuitm72wMNcxFgNBDmpJSbuD4UpwpEBUo4jMgoa25xYL6OA8JhfAZaenpgErnJ4Qoma3ohOHoE47XfRTTFQghx4Momq5wbL/WT0bdKHtEKxm9dnKBaa9Q0pNQWTAlwtgIDCCDw47Y/VUNFGch4HWxIYlYAs9aUYZqAgDmUBBG5l1WzYMq+wKHiA4kbv/E55YMTPJCAT+AePntm/JaGML3I367G5mVHwxFbAAAAAElFTkSuQmCC`,
      text: 'Utilities Included',
    }
  } else if (heat_incl && !water_incl) {
    return {
      icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAE2klEQVR4Xu2dj5ENQRCH+yJABIgAESACRIAIEAEiQATuInAiQASIABEgAuqr2y1bc/u8nX073b+hp+rqqu5mZ2f7m/43u9t7ZP21i2Z2x8xumdkVM7tuZvyN9sPMPpnZVzN7b2Zvh791c5VH3cz0TPhPzexB5ZyPzez5AKnyUP/uvQB5ZGbPJppQKyk0h+Nf1R7o3b8HII/N7MVGgnloZmiMbFMHctfM3sxI7/MgWPwFP2gADV+CT+EH03Zt5th7ZnaqSkQZCML9ODjuUX4/B0EvFShA0YgLEwA4/Buqzl4ZCCv89USQwCCyQiNqGtpCxDWFImu6lIGgBYS3YztZEWGNx6Il9ydjEQ6jPXJNGQjmitU9ttvDSl8jRDTr3eRAtAyzJdeUgfwqpHXoXLcerwnMQy+yyaSGQbcW4NbjNbn2BNJErOsHTSDrZdfkyATSRKzrB00g62XX5MgE0kSs6wdNIOtl1+TIBNJErOsH7QnI+qusO5LNR/a62P9ybwlkXuRAuepOw8wSyLzUvxXb/m5sEsh5UQODrf80WYVsyr2nrVep5GKUnNSOzcUEsrUEKsdLDakUWOvuCaS1hCvHbw1k13QyD9khmSggTCfzkBkokUAyDxECknlIkMmSDPklJ5V5SGX449S9tQ+RXIySk0oNcVryladprSGZh3QCJPOQoCjrb+sj85DMQ84kkE690o627p5AWku4cvwEUimw1t0TSGsJV47/PwPJPKRysUQlhpmHZB7yRwJpss6vhrwfEqQhkotRclK521vpbZ26t3bqkotRclKpIU5LvvI0rTUk85BOgGQeEhRl5f2QTjQk85AgDZEMaCQnZWYUvXxZqVG13anlKFcUUw0IpWCpIkd9K4/Ga2u8ccvD1RJNCQgQKHg5FkX2EhAFNCmMGfJOYXmRKkDK+opeMKbnkajDqABEAcYIJhxKNJBddXkjNGQ85yG1HQ+edyQQHDiFLr19xj6h4VMokBni6COBlFVH9wnK8/84eDTFvUUBoTA+XzpQbnxRgXm6tgggmKgvgqaqFDymiwI0Y115FzARQHrQjlH47lriDaQX7RiBuGuJNxClnGOpCXLNTbyBKEdWuwC5RlyeQMg7cOY9Npy7S17iCUQxK1+6ONy+yuMJpKfoqgTlFm15AsEW31y6JMX6ffC6R5NAlpH/J4FEPWe1TOT7e7ksXpeTDNeaQPZDd30LN4EkkAUSWN7FxZq4nGS4ZhKry8uvX6qnW2UHTyAZ9i5YY55AMjEUA5JbJ2JAuBfyfcGcFLtc8rpz6GmyEDSfPJ37pLYihHFOfCp8+gnYpnP1BpI3qPbg9AaC2SL8nX5Ku+mKO3BwPhnOfRy3Bx28gSCfnqItt233ceFEAGHF4UvUtcRdO4ASAaQXLXni8NLQOYsaBUQ94nKNrKZUIoGomi5MFWGuy0MNpYpEAmEuitm72wMNcxFgNBDmpJSbuD4UpwpEBUo4jMgoa25xYL6OA8JhfAZaenpgErnJ4Qoma3ohOHoE47XfRTTFQghx4Momq5wbL/WT0bdKHtEKxm9dnKBaa9Q0pNQWTAlwtgIDCCDw47Y/VUNFGch4HWxIYlYAs9aUYZqAgDmUBBG5l1WzYMq+wKHiA4kbv/E55YMTPJCAT+AePntm/JaGML3I367G5mVHwxFbAAAAAElFTkSuQmCC`,
      text: 'Heating Included, Water Seperate',
    }
  } else if (!heat_incl && water_incl) {
    return {
      icon: `data:image/png;base64,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`,
      text: 'Water Included, Heating Seperate',
    }
  } else {
    return {
      icon: `data:image/png;base64,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`,
      text: 'Utilities Not Included',
    }
  }
}

export const wifiIcon = ({ internet_incl }) => {
  if (internet_incl) {
    return {
      icon: `data:image/png;base64,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`,
      text: 'Internet Included',
    }
  } else {
    return {
      icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAKy0lEQVR4Xu2d3XXTSBTHNRq9L1sB6WBjLD8TKgAqIKmAUAFQAaGCDRWQVEB4toxDBZtUsMm7rdnz97nyyqP5lGZkGaRzfHJIZGk0v7nfdwRLxmNQM8AGNZpxMMkIZGCLYAQyAhnYDAxsOKOEjEAGNgMDG84oIYcGZLFYnAohPtG4z/I8vxrYM/xSw7FKSFEU/yZJ8qR6asbY2XQ6vfylZmFAD+MC5CFJkj/qYx6hxCNoBUIq6295CCOUOFCsQHDbEUqcyVdd1QnICGWAQPYBZblcHgkhnpZleSyEOGKMHUtTc5QkCT71AzbvVrJ5N0KIhzRNbxlj95PJ5K6/Kfa7k7OEVJeNpb6Wy+Xxer1+niTJCXl1+BntEEIADsDccM6/TyaTHYjRbmy5sDeQUJIiAagg7GsecF9I1s2+AbUC0hYKIKxWqzeMsVcKVbNPGKp73wkhrrIs+9Kn9LQG4goFdmC9Xr9MkuS8BYTHSrUIIe4YY7ewBdXsZVl2O5lMtv/G75fL5ZPVarW1NYyxJ0KIY8YY7BHsEGzOU0/6FZzPse1PJyAmKEKIC3p4SIPL8Qh1wRi7KcvydjabQX1EOyCtZVmeCCGgLvHZCX4NN4aDcDGbza5jDK4zEBMUhwFfA0Capjd9qgXVuCDJNUBYRDZAcAg+5Hn+xeE5nU8JAsQTCiBcpWl6Jasb51H3cGJRFIBSfUxwoEov0zSFOttRn22GGQyIBco9Y+zD0CHoJhBwhBDnjDG45boDMM67SkxrIPP5/CTLsgdZ1cSKU9qsttDfIVcdzskbi4352NYGegOBF7Ner5FshDg/cM5f/E5QyJM7Wq1Wp4wxwNGps0vO+Udfr8wLSFEUb2HI6vWR3xVKzcWGKnuvkZgHxtg7n/qRExCSiq/kHqru/TnPc6yWnSOE+qJg8mmapnBTn0j5LFV6ZSeXhTgmTVNMzMaNfvbs2fcIqgyxFhaqTpVdcc7PXIy+FQh5G1BR26ph9UBCiO9Zlp2bXFYfKBREPqdADsFdlHwWIFHMc0t5rCDJRthVaBCN8UdweWazLUYg8/n8E+lJeVE9wmuaTqcXLqvNBIUx9s96vYY9OlFkc10uH+KcoGmSxWJxLoSAxDTsC83bR92glUBMKoqk4tTXWOmghJjNwNcIAoc8MvQe/CWPDxKaZRmcoUbc0gBCF4K9kOsMCRkoJ6lQTVJLKPfIY1EmFpfd2IIsy+5Ui0LOZZHkbfNZnnmsztH4fD6HCmsYfYLyWn6GHSAE45vCXtxzzl+FSG/YoEACqzS4KnnYVRpqwDY5LEuwV90OTsFFmqbI/HrbG5pXLCRZhTXChi2QWv/VjvEmFQUYXmkBPHhZlm/TNL0eepzikSaBlkDGwTtNQmYAUGQVhnnd9rttgBhW7Zc8z099V+VisXiPVANJ2kEFjwQHz4ySge7AJCKx+NlnbggKVH7DPa66eJjBA0JA42Uv4PYxxuAiN+rchxbRk2pD0GeKxp1cWUV8Bi+s6gbd/hlQdECUq1q3Gog8bqCTJtQ6TlVtqD5xis9qDHUuqV600wKMsrCF+kiWZUiTOKl1na3eADGoLCcopsAxSRJU/DDYC9Nghw6lgksek05inKTFBAMpFtmoyx2KRiiGwBHP8Jlz/sF11RwKFJMdwENTNfGdSkJtMPCdHbdXMykNKKRfv2ki658Qb1uKwDNOgc69Qz4LdfGajbL1ZaF4dIeSMOf8IWQei+wlbGwj8KPOFcQYWxXmAqMBBL/QBDJbKIZYBasDdQCkDFoftjil9YX//+Kmbo9PCEBFUQAKsuDyccc5B5RbA4yG46RMnRRFgZBfds02wVHNna0PALbiVRup8JSUADx2LoEVfIV2ny5NCyQt2DfTCPyoXCGXLDAIZUihTS5qoDQmpG3giAu1CR5DE6ldr1NtnGwLFrIpfqlup43vjNleByjKOoht0ijNjvxO5SZ7BY9YXUKIS5VE1nNZUg0F6XzXfqxW1T48t8OcGYNtl3qISn0hheC9k0oBos7OC0rb+3u2+gDMO1dPsXqYLpkPKxAFddRCzn3KkriGlE7RCVG0yqPqho45rI3tnE6n2hqGwQ7C4Fd2xSkN5QSEoMBonXDOT3yyvoZ0SvUcaBFCJvVyX8Ej2TK0+sD46tSaU+BXh1PL8l655gSdgWDQ8P99YJBU6NzgTa+Wj6T1ETyS1GBlK8HYKn6ytABKkiSo3TilVZyB2Ay1tDLQJvNVEzi2Unk2/dzGppieieArJUZXXPKZI925wYGYAkd4R5xzNEU4rRbdoPuQlMotp24SVeDnlOvzhRQUiK7IlSQJyrCnoQJHchKQge1ldzDZQXibshrz7ruyAQoGxODqXXPO0RTRSSoMnkwDCpWAN3ksSpN03ldoCvxCqssgQIqiwKQ0aiFdc1s/fvx4XmsROvIpcikABukm0TUtJElymef5mU0CbH/vDISCPTSeyXmcmzzPX9gGoPBKsE/jjSZn5hU8Gu7daUdUURRoBJGb+B4558dtmiDq4+wMhIwfdtA2uip82obIGYDxtNXwQ0Gp5sErTaKREMDwis+ie1m6VhebfqXc03tNh6Q87vtq25sqfumYuremSTTXDwYDDxtEQqpZ84Wi6aaXIWDLGJqVse3N6hjooCArzRjD943dJLpu9T5gBAdiUV/bZKS0x0QlvU7plDZxCnZxlWVpS5PsSEtfMKIAsUHB6y3W67WyVRXxCm0L6/ySNJfg0RSNI92Bih+91kN2rYOqqeBGXbVSKSeEiXc5nLpTXC5UP8cFCs63dJM0biuEeBEyyO0FCG7iaGR/Ut+wd8+sCyBXKHDfV6vVpa3X1+akuIzJdE5Qo666kQWKU42g60O6QsF9DE0LrYpyvmOPDkQnKbFXmjwRPlBU5/Y13l6ASFA6dajQKzFe0isx0Hq0s++Q3o2C4BGl151XLvlAqXeS9AUjmpdlckfhZfkUucjoookbbUnY+tbY66i5n1dEr5p0gn/sU0TzVVHy+b1JSJuB0ipFd0rbzZ+dobQZd5fvDBKIwzZsn2c+KCiDA2KpOALENp9VluVdfa8hua5HaZri3VjVa5dQVDoYKIMCQrkt3Saha+os93qPFqk9bCF47lNP6dOQ9xYY+ugVXZErSRIEjqg4dnpJJb0RAntVGi868PG+fJ6pzbmDkBBDhrZzN70iHjlXvTBtKFAGAYQi5EbLqmmDfZvVV9vX4lUO7lN9DQaIbttwKCiKTUaDNPSDAYIVb9jL3bmBQGWjULSazWaNGGef6mtQQGJB0TgMcBZQB1dWIfcFZXBAQkNpA6OyT/uAMkggoaB0gbEvKIMF0hVKCBj7gDJoIAQFr89TNeJpDb0GRqdGtr7U1+CBEBTnRjx6m5v8HpEgTQl9QDkIIBYo2/aiPtp1YkM5GCA2KPi7YntCEMlQpF+ibYU4KCAmKIpUShQYsQ39wQFxhBIVRkwoBwkEE0J1DmwLaBwxG9liq6+DBYKJ2We7Th1MSEN/0EBkKH2myWNJysEDqaDgZ5/tOipVGUJSfgkgqsnZ1++6QhmBRCBn6Gd+bfv/6EcgEYDoHA60I+V5/qfpliOQSEA0UB7zPDe2wo5AIgLBpWnjEho4kNqxvgZxBBIZiO/lRyC+Mxb5/BFI5An2vfwIxHfGIp8/Aok8wb6XH4H4zljk80cgkSfY9/IjEN8Zi3z+f1IX5Gtr3GwFAAAAAElFTkSuQmCC`,
      text: 'Internet Seperate',
    }
  }
}

export const electricityIcon = ({ elec_incl }) => {
  if (elec_incl) {
    return {
      icon: `data:image/png;base64,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`,
      text: 'Hydro Included (Electricity)',
    }
  } else {
    return {
      icon: `data:image/png;base64,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`,
      text: 'Hydro Seperate (Electricity)',
    }
  }
}

export const parkingIcon = ({ free_parking, paid_parking }) => {
  if (free_parking) {
    return {
      icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAD7UlEQVR4Xu2dgZENQRCG/4sAESACRIAIEAEiQASIABFwESACRIAIkAERUH/Vvqq9uZud7p3uvVn3T9WrU266d973vdl9u9s7dwS1oQgcDTUaDQYSMtiHQEJ2LuQhgKcAbg72PkYdzjcArwEcWwdonSGXAXySCCvWU/0o5i6A360MViFfJaOFsvl7SrnV6mURwl3Uq1Yi/d5E4DGAd0s9LUI0O0ysTZ2as8Qi5K9pU+pkJbDIXEKsGOP6SUgcy5BMEhKCMS6JhMSxDMkkISEY45JISBzLkEwSEoIxLomExLEMySQhIRjjkkhIHMuQTBISgjEuiYTEsQzJJCEhGOOSSEgcy5BMEhKCMS6JhMSxDMm0GyGWezM9RFgpw2KNO1N9wL2eZB2xElKBRzmsF+DrUgdgb6iENIhRzAsAT7xkV/aXECO4RwDeGvv2dNutkKjiip8ADq8PAL4sFKzdB/C+h7Yh9sILKRmxepDlnW8qYrj7em4Au7aLhFTIsUaKhWv8WTb+3421xBtxErIAiLOFNbelFH41Zi1zRpOQBtVaNSGPO1cTjEiIAepZNbdZNc0SYhDC2XC96Mcze9Y1RzcJMRLlowLlsSTqq/d8CBJiFPJs+jo87/4ZwG1jvLWbhBhJvZwuoUjIRKD85GTsLpbcSEhBR0IA03PqW31SJURCTszRBwB48XHeMh7n00HdeFC/csbFxoy9g4QYhPCSPK9fzVvW9SwJMQjhBUaec8wbL9Fn3EWUkIaQjwB4Y6psPwBcM8j0dpGQBWLfp11VueRF5u1cCakIqclg0QO/XWXMDg5FQgohf6bSn9oSF1nHjsMwLryQX1ORA6/k8sBdnmvMfWXuqnYvxHuw7O2/hYxd77J6AVvjeczgakcUskXb7S4rGw5F8DyDt2r5762ahEykeUuWNbw8Az+8tpIw385uhWRcRzoPAeU2JWQEC7MxSIiErCNw3jeo1o3aH6UZ4meWGiEhqXj9ySXEzyw1QkJS8fqTS4ifWWqEhKTi9SeXED+z1AgJScXrTy4hfmapERKSitefXEL8zFIjJCQVrz+5hPiZpUZISCpef3IJ8TNLjZCQVLz+5BLiZ5YaISGpeP3JdyPE/9b2GSEhg3mTEAkZjMBgw9EMkZDBCAw2HM0QCRmMwGDD0QyRkMEIDDYczRAJGYzAYMPRDPnfhGQuuz0Yq/ThcPUIPutYbYvTZ4ra6vntdBoDbOCsBZtPDMsihAGaJf02m7ODm7AK4XPcXJYi6y8G9L/dsTPUFro5NWqrkEMgd1980F5ibB8AiuBiNrWFbrqF2IahXqsJeGfI6g0p0EZAQmycNuslIZuhtm3oHz372GW+S2ITAAAAAElFTkSuQmCC`,
      text: 'Free Parking',
    }
  } else if (paid_parking) {
    return {
      icon: `data:image/png;base64,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`,
      text: 'Paid Parking',
    }
  } else {
    return {
      icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAFhklEQVR4Xu3d3XXbNhQAYEDge5MNnAkaHoHPSSZoMkHsCepOUHWC2BPE3cCZwM6zINOaoO0Ecd4poefmUA5FgwRA4o/05VsiCgTuR/yJIEwJHklFgCaVG8wMQZDEbgIEmTKIEOKjlPKcUvo6sXIkmR0p5T2l9IJz/rdpBo1qSFmWL6qqukEI07AenwcwWZa9y/P8QZeCEch6vS4RQxfK/s8BpSiKXJeKFmSz2ZxKKT/rEsLP9RGglJ4tl8urvjO1IIrasWWMvTWpfvoszveMsixPqqq6opS+OZTSpJZoQYQQshk2Sukfy+XyYr6hdFcyQNntdv80U+Sc98bcGgQSN6l67oo17ZTaN7QXEEQxv0mCgSCKGUpQEETRowQHQZR+FO8g0KGr5iXY0athvIPAKKFrsogoT1GCgMBlEUXff8AZwUAQJUEQRNGjBK0hh+xg89UNEwUEa0qCIIgScdjb13Ji83UcnWhNVjMbiPIzGkmAYPOVIIgNSvsu0g8m7c+oV4A8UEpv9/s9PN/+Yp+K/TeSqSE2Q+IQIIpQAs7FYrG49Pk4OjkQk5oSCeRgBEtzVpzzS/v7X/+NJEF0KImsarninJ/pQ2x3RrIgfSiqIkop39kVvfvsxWJxIqWE1ZZvCSG/9qR7zTn/4Oq6kE7SIDYousUAQ4NWrwRZEUI+dtwIfxVFAZ87OZIHMUXxBXKIclmWr3e73S0h5Jd25BljeZ7n9y5EJgFiguIbBPIAa5Z3u92/CpRbzrmTJnMyIDqUECA1CtSUUlFLXuV5DlijjkmB6EZfunWwoyLV+LIQAtbbtvuUS875+dhrTA4kBRTVkk+TdbgmWJMESQFFCAGd+NGQ2EWzOVmQ2ChCCFhA/nvzroe5UFEUMBIbfEwaJCbKer1eUUr/RBDFvRfjeQqCNCBgktaeiIVGQZDjYec3xhi8FHk0Ow6JgiDHIPCW1kNMFCHENSHkt2YLyhgbPTmcZKfeyHQ0FCHEN0LIiwbId85589+DRlpTB4FCB0fpaBq/cM7fD1J4Wvsf/0c3t7F+x1CX4JACKJ4YPnDOX7bT8tWnCCFu6mclj5d0tZJ/DjXkR1C64F2jqDpzQsh3xtiJi2ftswdxOXnswpVSOntI9SxAxqLUz0E+EUJOFU3sf4wxmBdp9yUxaZ6fDcgQlLu7uzf7/R4QVBA/4uvyaSGkNxsQSumT59pSyi3nHOYLj0dPs3PR2jAHFjj0Hq468uZFZgPSFTnVL7AONsiBThz2b3HyHP1ZgdjOU3S1ghByyRhbueoz2tebfQ2pC2w1eVSgbKWU11mWXbl4bt6HPhsQKeXXvoJSSgHltH1n9/QpkN4qy7J7X7VBld/ZgIz5RcD15NGg2es8BUHq0KSCgiAGQ2Ifw9uuKoIgrcjErikIorhVY6IgSEfbEQsFQXqGRDFQEEQzRg2NgiAGk4aQKAhiAAKnhEJBEEOQUCgIYgESAgVBLEF8oyDIABCfKAgyEMQXCoKMAPGBgiAjQVyjIIgDEJcoCOIIxBUKgjgEcYGCII5BxqIgiAeQMSiTBPEUQ+fJDvlBEkGcMxwnaIuCIJ5BbJsvBAkAYoOCIIFATFEQJCCICQqCBAbRobS3wNWtWU7itegIMXR+SdOXhhDEeei7EzRBQZCAIH3N1yEbCBIYRIeCIBFA+lCcgzDGXoZ8JSxSPJ1cdrPZnEspYYOCx8MFSHu3zlvG2JnvlyWdRCRiIrBbRFVVN6135eE9e/ijAJ2HdthrMnKIWO5JXdrkzS0tCJRYtaftpCKRRma1tQOyaQRSb9YC+9f2/e2NNIqdZi629U4R2g1tjEAOZaybL9gPHWHM4Lfwd65s9rC3AjHLA541JgIIMiZ6Hr6LIB6COiZJBBkTPQ/f/R9J2Le/K5uuyQAAAABJRU5ErkJggg==`,
      text: 'No Parking',
    }
  }
}
